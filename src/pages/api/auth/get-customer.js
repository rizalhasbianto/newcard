import { adminAPi } from 'src/lib/shopify'

export default async function getCustomer(req, res) {
    const emailTerm = req.query?.email ? `query:"email:${req.query?.email}"` : "";
    const query = `{
        customers(first: 10, ${emailTerm}) {
          edges {
            node {
              id
            }
          }
        }
    }`;

  const getCustomer = await adminAPi(query);
  
  res.status(200).json({ newData: getCustomer })
}