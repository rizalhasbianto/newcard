import { GetQuoteByCompany } from "src/service/use-mongo";

export const CompanyQuote = (props) => {
    const { company } = props
    const { data, isLoading, isError } = GetQuoteByCompany(company, 0, 1);
    return (
        <></>
    )
}