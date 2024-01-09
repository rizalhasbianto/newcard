import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import Catalogs from './catalogs'

const Page = () => (
    <Catalogs />
)

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;