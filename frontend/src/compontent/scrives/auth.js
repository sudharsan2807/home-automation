import { ID_GET } from './storge';

export default function Auth() {
    const id1 = "65184421f3e8b90e4c6e659a"
    const id2 = "6518442bf3e8b90e4c6e65a0"
    if (ID_GET() !== null) {
        return ID_GET() === id1 || id2 ? true : false
    }
}
