import { Balance } from "../components/Balance"
import  AllUsers  from "../components/AllUsers"
function Dashboard() {
    return <div>
        <div className="m-8">
            <Balance value={"10,000"} />
            <AllUsers />
        </div>
    </div>
}

export default Dashboard