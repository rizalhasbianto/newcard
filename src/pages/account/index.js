import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import Account from './account'

const Page = () => (
    <Account />
)

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;