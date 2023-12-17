import Head from "next/head";
import { useState, useCallback, useEffect } from "react";
import { GetInventorySwr } from "src/service/use-shopify";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { Box, Container } from "@mui/material";
import TableLoading from "src/components/table-loading";
import { InventoryTable } from "src/sections/products/invetory-table";

const Page = () => {
  const [fetchData, setFetchData] = useState({
    direction: "",
    startCursor: "",
    endCursor: "",
  });
  const [pageNumber, setPageNumber] = useState(0);

  const [hasPrev, setHasPrev] = useState(false);
  const [hasNext, setHasNext] = useState(false);

  const { data, isLoading, isError } = GetInventorySwr(fetchData);

  const handlePageChange = useCallback(
    async (value) => {
      setFetchData({
        direction: value,
        startCursor: data.newData.pageInfo.startCursor,
        endCursor: data.newData.pageInfo.endCursor,
      });

      if (value === "next") {
        setPageNumber(pageNumber + 1);
      } else {
        setPageNumber(pageNumber - 1);
      }
    },
    [data, pageNumber]
  );

  useEffect(() => {
    if (!data) return;
    setHasPrev(data.newData.pageInfo.hasPreviousPage);
    setHasNext(data.newData.pageInfo.hasNextPage);
  }, [data]);
  
  return (
    <>
      <Head>
        <title>Add New Ticket | skratch</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          {isLoading && <TableLoading />}
          {isError && <h2>Error loading data</h2>}
          {data && (
            <InventoryTable
              items={data.newData.edges}
              handlePageChange={handlePageChange}
              hasPrev={hasPrev}
              hasNext={hasNext}
              pageNumber={pageNumber}
            />
          )}
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
