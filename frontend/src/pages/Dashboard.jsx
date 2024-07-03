import { Balance } from "../components/Balance"
import  AllUsers  from "../components/AllUsers"
import Appbar from "../components/Appbar"
function Dashboard() {
    return <div>
        <Appbar/>
        <div className="m-8">
            <Balance value={"10,000"} />
            <AllUsers />
        </div>
    </div>
}

export default Dashboard