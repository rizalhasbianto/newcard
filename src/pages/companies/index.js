import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import Companies from './companies'

const Page = () => (
    <Companies />
)

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;