import { useRouter } from 'next/router'
 
export default function Page() {
  const router = useRouter()
  console.log("router.query.slug", router.query.productId)
  return <p>Post: {router.query.productId}</p>
}