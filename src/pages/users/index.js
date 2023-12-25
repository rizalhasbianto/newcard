import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import Users from './users'

const Page = () => (
    <Users />
)

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;