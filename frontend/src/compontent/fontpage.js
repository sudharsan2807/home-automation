import React, { Fragment, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import Enterypass from './alert/enterypass';

export default function App() {
    const [entery, Setentery] = useState(false)
    const enteryhandler = () => {
        Setentery(!entery);
    }
    return (
        <Fragment>
            <div className="container">
                <div className="contain">
                    <div className="col-1">
                        <span>jewelry</span>
                        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laborum, modi quisquam reiciendis aut aliquid adipisci tempore, dolore possimus alias temporibus nisi magnam in, architecto rerum. Ut temporibus placeat laboriosam tempora!</p>
                        <button onClick={enteryhandler}>View More <i className="fa-solid fa-caret-right"></i></button>
                    </div>
                    <div className="col-2">
                        <Swiper
                            spaceBetween={30}
                            centeredSlides={true}
                            autoplay={{
                                delay: 2000,
                                disableOnInteraction: false,
                            }}
                            pagination={{
                                clickable: true,
                            }}
                            modules={[Autoplay, Pagination, Navigation]}
                            className="mySwiper"
                        >
                            <SwiperSlide>
                                <img src="/material/slider1.png" alt="slide_image" />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img src="/material/slider2.png" alt="slide_image" />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img src="/material/slider3.png" alt="slide_image" />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img src="/material/slider4.png" alt="slide_image" />
                            </SwiperSlide>
                        </Swiper>
                    </div>
                </div>
            </div>
            {
                entery ? <Enterypass close={enteryhandler} /> : null
            }
        </Fragment>
    );
}
