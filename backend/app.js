const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/Bussiness', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to mongodb");
}).catch((err) => {
    console.log(err);
})

const passshema = new mongoose.Schema({
    password: String
})

const passmodel = mongoose.model('passwordjew', passshema);

app.post('/bussiness/pass/post', async (req, res) => {
    const data = new passmodel({
        password: req.body.password
    })
    try {
        const save = await data.save();
        res.json(save);
    } catch (err) {
        res.json(err)
    }
})

app.get('/bussiness/pass/all', async (req, res) => {
    try {
        let fetch = await passmodel.find();
        res.json(fetch);
    } catch (err) {
        res.json(err)
    }
})

require('./stock');

const stockmodel = mongoose.model("Stock");

app.post('/bussiness/stock/post', async (req, res) => {
    const { bill, product } = req.body;
    try {
        const codes = product.map(p => p.code);

        // Check if any of the codes already exist in the database
        const exists = await stockmodel.findOne({ code: { $in: codes } });

        if (exists) {
            res.status(404).json("Code already existed");
        } else {
            const data = new stockmodel({
                bill,
                product,
            });

            const datsave = await data.save();
            res.json(datsave)
        }
    } catch (err) {
        res.status(500).json(err);
    }
});


app.post('/bussiness/stock/post/add/:id', async (req, res) => {
    const id = req.params.id;
    const { product } = req.body; // Assuming you want to add customers to the "customer" array

    try {
        const updatedData = await stockmodel.findByIdAndUpdate(
            id,
            { $push: { product: product } }, // Use $push to add the new customer data to the "customer" array
            { new: true }
        );

        res.json(updatedData);
    } catch (err) {
        res.json(err);
    }
});

app.get('/bussiness/stock/all', async (req, res) => {
    const fetch = await stockmodel.find();
    try {
        res.json(fetch);
    } catch (err) {
        res.json(err)
    }
})

app.get('/bussiness/stock/search', async (req, res) => {
    const search = req.query.search; // Use req.query to access query parameters
    try {
        // Use Mongoose to search for customer records that contain the search value within the "customer" array
        const data = await mongoose.model('Stock').find({
            'product': {
                $elemMatch: {
                    $or: [
                        { code: { $regex: new RegExp(search, 'i') } },
                        { name: { $regex: new RegExp(search, 'i') } },
                    ]
                }
            }
        });

        if (!data || data.length === 0) {
            res.status(404).json({ message: "No matching records found" });
        } else {
            // Build an array of all matching elements from the "customer" array
            const matchingElements = [];
            data.forEach(item => {
                if (item.product && Array.isArray(item.product)) {
                    item.product.forEach(stockItem => {
                        if (
                            stockItem.code.toLowerCase().includes(search.toLowerCase()) ||
                            stockItem.name.toLowerCase().includes(search.toLowerCase())
                        ) {
                            matchingElements.push(stockItem);
                        }
                    });
                }
            });

            if (matchingElements.length > 0) {
                res.status(200).json(matchingElements); // Send a 200 status with the matching elements array
            } else {
                res.status(404).json({ message: "No matching array elements found" });
            }
        }
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/bussiness/stock/get/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        const stockData = await stockmodel.findOne({ 'product._id': productId }).exec();

        if (!stockData) {
            return res.status(404).json("Product not found");
        }

        // Find the matching product item within the product array
        const productItem = stockData.product.find(item => item._id.toString() === productId);

        if (!productItem) {
            return res.status(404).json("Product item not found");
        }

        res.json(productItem);
    } catch (err) {
        res.json(err);
    }
});

app.get('/bussiness/stock/getcode/:code', async (req, res) => {
    const code = req.params.code;

    try {
        const stockData = await stockmodel.findOne({ 'product.code': code }).exec();

        if (!stockData) {
            return res.status(404).json("Product not found");
        }

        // Find the matching product item within the product array
        const productItem = stockData.product.find(item => item.code.toString() === code);

        if (!productItem) {
            return res.status(404).json("Product item not found");
        }

        res.json(productItem);
    } catch (err) {
        res.json(err);
    }
});

app.get('/bussiness/stock/getbill/:bill', async (req, res) => {
    const bill = req.params.bill;
    const fetch = await stockmodel.find({ bill: bill }).exec();
    try {
        res.json(fetch);
    } catch (err) {
        res.json(err);
    }
});


app.get('/bussiness/customer/latest', async (req, res) => {
    try {
        // Find the latest data based on createdAt
        const latestCustomer = await mongoose.model('Customer').findOne().sort({ createdAt: -1 });

        if (!latestCustomer) {
            return res.status(404).json({ error: 'No customers found' });
        }

        res.json(latestCustomer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/bussiness/stock/delete/:productId', async (req, res) => {
    const productId = req.params.productId;

    try {
        const updatedData = await stockmodel.findOneAndUpdate(
            { 'product._id': productId },
            { $pull: { product: { _id: productId } } },
            { new: true }
        ).exec();

        if (!updatedData) {
            return res.status(404).json("Product not found");
        }

        res.json(updatedData);
    } catch (err) {
        res.json(err);
    }
});

app.delete('/bussiness/stock/deletebill/:productId', async (req, res) => {
    const productId = req.params.productId;
    const fetch = await stockmodel.findByIdAndDelete({ _id: productId });

    try {
        res.json(fetch)
    } catch (err) {
        res.json(err)
    }
});

app.put('/bussiness/stock/upd/:productId', async (req, res) => {
    const productId = req.params.productId;

    try {
        // Find the stock document containing the product with the given productId
        const stockData = await stockmodel.findOne({ 'product._id': productId });

        if (!stockData) {
            return res.status(404).json('Product not found');
        }

        // Find the index of the matching product item within the product array
        const productIndex = stockData.product.findIndex(
            (item) => item._id.toString() === productId
        );

        if (productIndex === -1) {
            return res.status(404).json('Product item not found');
        }

        // Update the product item with the new data from the request body
        stockData.product[productIndex] = {
            ...stockData.product[productIndex],
            ...req.body,
        };

        // Save the updated stock document
        const updatedStock = await stockData.save();

        res.json(updatedStock);
    } catch (err) {
        res.status(500).json(err);
    }
});


require('./customer');

const custmodel = mongoose.model("Customer")

app.post('/bussiness/customer/post', async (req, res) => {
    const { bill, customer } = req.body;
    try {
        const data = new custmodel({
            bill,
            customer
        })

        const datsave = await data.save();
        res.json(datsave)
    } catch (err) {
        res.json(err)
    }
})

app.post('/bussiness/customer/post/add/:id', async (req, res) => {
    const id = req.params.id;
    const { customer } = req.body; // Assuming you want to add customers to the "customer" array

    try {
        const updatedData = await custmodel.findByIdAndUpdate(
            id,
            { $push: { customer: customer } }, // Use $push to add the new customer data to the "customer" array
            { new: true }
        );

        res.json(updatedData);
    } catch (err) {
        res.json(err);
    }
});

app.get('/bussiness/customer/all', async (req, res) => {
    const fetch = await custmodel.find();
    try {
        res.json(fetch);
    } catch (err) {
        res.json(err)
    }
})

app.get('/bussiness/customer/search', async (req, res) => {
    const search = req.query.search; // Use req.query to access query parameters
    try {
        // Use Mongoose to search for customer records that contain the search value within the "customer" array
        const data = await mongoose.model('Customer').find({
            'customer': {
                $elemMatch: {
                    $or: [
                        { code: { $regex: new RegExp(search, 'i') } },
                        { name: { $regex: new RegExp(search, 'i') } },
                        { city: { $regex: new RegExp(search, 'i') } }
                    ]
                }
            }
        });

        if (data.length === 0) {
            res.status(404).json({ message: "No matching records found" });
        } else {
            // Build an array of all matching elements from the "customer" array
            const matchingElements = [];
            data.forEach(item => {
                item.customer.forEach(customerItem => {
                    if (
                        customerItem.code.toLowerCase().includes(search.toLowerCase()) ||
                        customerItem.name.toLowerCase().includes(search.toLowerCase()) ||
                        customerItem.city.toLowerCase().includes(search.toLowerCase())
                    ) {
                        matchingElements.push(customerItem);
                    }
                });
            });

            if (matchingElements.length > 0) {
                res.status(200).json(matchingElements); // Send a 200 status with the matching elements array
            } else {
                res.status(404).json({ message: "No matching array elements found" });
            }
        }
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/bussiness/customer/get/:id', async (req, res) => {
    const customerId = req.params.id;

    try {
        const customerData = await custmodel.findOne({ 'customer._id': customerId }).exec();

        if (!customerData) {
            return res.status(404).json("Product not found");
        }

        // Find the matching product item within the product array
        const customerItem = customerData.customer.find(item => item._id.toString() === customerId);

        if (!customerItem) {
            return res.status(404).json("Product item not found");
        }

        res.json(customerItem);
    } catch (err) {
        res.json(err);
    }
});


app.get('/bussiness/customer/getbill/:bill', async (req, res) => {
    const bill = req.params.bill;
    const fetch = await custmodel.find({ bill: bill }).exec();
    try {
        res.json(fetch);
    } catch (err) {
        res.json(err);
    }
});

app.get('/bussiness/customer/getcode/:code', async (req, res) => {
    const code = req.params.code;

    try {
        const customerData = await custmodel.findOne({ 'customer.code': code }).exec();

        if (!customerData) {
            return res.status(404).json("Product not found");
        }

        // Find the matching product item within the product array
        const customerItem = customerData.customer.find(item => item.code.toString() === code);

        if (!customerItem) {
            return res.status(404).json("Product item not found");
        }

        res.json(customerItem);
    } catch (err) {
        res.json(err);
    }
});

app.delete('/bussiness/customer/delete/:productId', async (req, res) => {
    const customerId = req.params.productId;

    try {
        const updatedData = await custmodel.findOneAndUpdate(
            { 'customer._id': customerId },
            { $pull: { customer: { _id: customerId } } },
            { new: true }
        ).exec();

        if (!updatedData) {
            return res.status(404).json("Product not found");
        }

        res.json(updatedData);
    } catch (err) {
        res.json(err);
    }
});

app.delete('/bussiness/customer/deletebill/:productId', async (req, res) => {
    const productId = req.params.productId;
    const fetch = await custmodel.findByIdAndDelete({ _id: productId });

    try {
        res.json(fetch)
    } catch (err) {
        res.json(err)
    }
});

app.put('/bussiness/customer/upd/:productId', async (req, res) => {
    const productId = req.params.productId;

    try {
        // Find the stock document containing the product with the given productId
        const customerdata = await custmodel.findOne({ 'customer._id': productId });

        if (!customerdata) {
            return res.status(404).json('Product not found');
        }

        // Find the index of the matching product item within the product array
        const productIndex = customerdata.customer.findIndex(
            (item) => item._id.toString() === productId
        );

        if (productIndex === -1) {
            return res.status(404).json('Product item not found');
        }

        // Update the product item with the new data from the request body
        customerdata.customer[productIndex] = {
            ...customerdata.customer[productIndex],
            ...req.body,
        };

        // Save the updated stock document
        const updatedStock = await customerdata.save();

        res.json(updatedStock);
    } catch (err) {
        res.status(500).json(err);
    }
});

require('./supplier')

const suppliermodel = mongoose.model("Supplier");

app.post('/bussiness/supplier/post', async (req, res) => {
    const { name, balance, supplier } = req.body;
    try {
        const data = new suppliermodel({
            name,
            balance,
            supplier
        })

        const datsave = await data.save();
        res.json(datsave)
    } catch (err) {
        res.json(err)
    }
})

app.post('/bussiness/supplier/post/add/:id', async (req, res) => {
    const id = req.params.id;
    const { supplier, balance } = req.body; // Assuming you want to add customers to the "customer" array

    try {
        const updatedData = await suppliermodel.findByIdAndUpdate(
            id,
            { $push: { supplier: supplier } }, // Use $push to add the new customer data to the "customer" array
            { new: true }
        );

        res.json(updatedData);
    } catch (err) {
        res.json(err);
    }
});

app.get('/bussiness/supplier/all', async (req, res) => {
    const fetch = await suppliermodel.find();
    try {
        res.json(fetch);
    } catch (err) {
        res.json(err)
    }
})

app.get('/bussiness/supplier/getmain/:id', async (req, res) => {
    const supplierid = req.params.id;

    try {
        const supplier = await suppliermodel.findOne({ _id: supplierid }).exec();

        res.json(supplier);
    } catch (err) {
        res.json(err);
    }
});

app.get('/bussiness/supplier/get/:id', async (req, res) => {
    const supplierid = req.params.id;

    try {
        const supplier = await suppliermodel.findOne({ 'supplier._id': supplierid }).exec();

        if (!supplier) {
            return res.status(404).json("Product not found");
        }

        // Find the matching product item within the product array
        const supplierItem = supplier.supplier.find(item => item._id.toString() === supplierid);

        if (!supplierItem) {
            return res.status(404).json("Product item not found");
        }

        res.json(supplierItem);
    } catch (err) {
        res.json(err);
    }
});


app.get('/bussiness/supplier/getbill/:bill', async (req, res) => {
    const bill = req.params.bill;
    const fetch = await suppliermodel.find({ bill: bill }).exec();
    try {
        res.json(fetch);
    } catch (err) {
        res.json(err);
    }
});

app.delete('/bussiness/supplier/delete/:productId', async (req, res) => {
    const supplierId = req.params.productId;

    try {
        const updatedData = await suppliermodel.findOneAndUpdate(
            { 'supplier._id': supplierId },
            { $pull: { supplier: { _id: supplierId } } },
            { new: true }
        ).exec();

        if (!updatedData) {
            return res.status(404).json("Product not found");
        }

        res.json(updatedData);
    } catch (err) {
        res.json(err);
    }
});

app.delete('/bussiness/supplier/deletebill/:productId', async (req, res) => {
    const productId = req.params.productId;
    const fetch = await suppliermodel.findByIdAndDelete({ _id: productId });

    try {
        res.json(fetch)
    } catch (err) {
        res.json(err)
    }
});

app.put('/bussiness/supplier/upd/:productId', async (req, res) => {
    const productId = req.params.productId;

    try {
        // Find the stock document containing the product with the given productId
        const customerdata = await suppliermodel.findOne({ 'supplier._id': productId });

        if (!customerdata) {
            return res.status(404).json('Product not found');
        }

        // Find the index of the matching product item within the product array
        const productIndex = customerdata.supplier.findIndex(
            (item) => item._id.toString() === productId
        );

        if (productIndex === -1) {
            return res.status(404).json('Product item not found');
        }

        // Update the product item with the new data from the request body
        customerdata.supplier[productIndex] = {
            ...customerdata.supplier[productIndex],
            ...req.body,
        };

        // Save the updated stock document
        const updatedStock = await customerdata.save();

        res.json(updatedStock);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.put('/bussiness/supplier/:id', async (req, res) => {
    const id = req.params.id;
    const fetch = await suppliermodel.findByIdAndUpdate(id, req.body)
    try {
        res.json(fetch).status(200)
    } catch (err) {
        res.json(err)
    }
})

app.listen(5000, () => {
    console.log('Connected to the local host 5000');
})