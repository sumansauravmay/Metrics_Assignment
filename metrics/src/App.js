import { useEffect, useState } from "react";
import "./App.css";
import {
  Input,
  InputGroup,
  InputLeftAddon,
  Container,
  Flex,
  Text,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import Loading from "./components/Loading";

function App() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  useEffect(() => {
    setLoading(true);
    axios
      .post(
        `http://playground.siglens.com:5122/metrics-explorer/api/v1/metric_names`,
        {
          start: "now 1h",
          end: "now",
        }
      )
      .then(function (response) {
        setLoading(false);
        // console.log(response.data.metricNames);
        // console.log(response.data.metricNamesCount);
        const sortedData = response.data.metricNames.sort((a, b) =>
          a.localeCompare(b)
        );
        console.log(sortedData);
        setData(sortedData);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Container mt={10}>
      <Flex gap={10} width={"700px"} ml={-20}>
        <InputGroup size="sm">
          <InputLeftAddon>Metric</InputLeftAddon>

          <Input
            type="text"
            placeholder="Search metrics"
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>

        <InputGroup size="sm">
          <InputLeftAddon>Tag</InputLeftAddon>
          <Input type="text" placeholder="Filter by Tag Name" />
        </InputGroup>
      </Flex>
      {/* 1+currentPage*10 */}
      <Text mt={10}>
        {" "}
        Showing {currentPage===1?currentPage:itemsPerPage*(currentPage-1)+1}-{itemsPerPage*currentPage>data.length?data.length:itemsPerPage*currentPage} of {data.length}
      </Text>

      <main>
        <table>
          <thead>
            <tr>
              <th>Metric Name</th>
              <th>Last Configured</th>
            </tr>
          </thead>
          <tbody>
            {currentItems
              .filter((item) => {
                if (item === "All") {
                  return item;
                } else if (item.toLowerCase().includes(search.toLowerCase())) {
                  return item;
                }
              })

              .map((item) => (
                <tr key={item}>
                  <th>{item}</th>
                  <th>-</th>
                </tr>
              ))}
          </tbody>
        </table>
      </main>

      <Flex ml={200} gap={5} mt={5} mb={10}>
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          style={{ color: "#3C99DC" }}
        >
          Previous
        </button>
        {[...Array(totalPages)].map((el, index) => (
          <Button
            color={"blue.600"}
            key={index}
            onClick={() => handlePageChange(index + 1)}
            disabled={currentPage === index + 1}
          >
            {index + 1}
          </Button>
        ))}
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          style={{ color: "#3C99DC" }}
        >
          Next
        </button>
      </Flex>
    </Container>
  );
}

export default App;
