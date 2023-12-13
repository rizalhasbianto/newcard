import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import Tickets from './tickets'

const Page = () => (
    <Tickets />
)

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;