import { GetSingleCompaniesSwr, GetCompanies } from "src/service/use-mongo";

export const CompanyQuote = (props) => {
    const { data, isLoading, isError } = GetSingleCompaniesSwr(router.query.companyId, 0, 1);
    return (
        <></>
    )
}