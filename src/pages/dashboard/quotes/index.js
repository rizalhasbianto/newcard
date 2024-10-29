import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import Quotes from './quotes'

const Page = () => (
    <Quotes />
)

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;