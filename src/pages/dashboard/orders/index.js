import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import Orders from './orders'

const Page = () => (
    <Orders />
)

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;