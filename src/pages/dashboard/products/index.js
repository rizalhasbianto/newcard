import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import Products from './products'

const Page = () => (
    <Products />
)

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;