import { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Flex,
  Table,
  Thead,
  Tr,
  Tbody,
  Td,
  VStack,
  useToast,
} from "@chakra-ui/react";
import Header from "../components/header";
import api from "../services/api";
// @ts-ignore
import styled from "styled-components";

export default function Home() {

  const TH = styled.th `
  background:#3182CE;
    color: white;
  `

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState(null);
  const [clients, setClients] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isValidFormData = () => {
    if (!name) {
      return toast({
        title: "Remplissez le champ nom",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    if (!email) {
      return toast({
        title: "Remplissez le champ e-mail",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    if (clients.some((client) => client.email === email && client._id !== id)) {
      return toast({
        title: "E-mail déjà enregistré !",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleSubmitCreateClient = async (e) => {
    e.preventDefault();

    if (isValidFormData()) return;
    try {
      setIsLoading(true);
      const { data } = await api.post("/clients", { name, email });
      setClients(clients.concat(data.data));
      setName("");
      setEmail("");
      setIsFormOpen(!isFormOpen);
      toast({
        title: "Enregistré avec succès",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleDeleteClient = async (_id) => {
    try {
      await api.delete(`/clients/${_id}`);
      toast({
        title: "Suprimmé avec succès",
        status: "info",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handlShowUpdateClient = (client) => {
    setId(client._id);
    setName(client.name);
    setEmail(client.email);
    setIsFormOpen(true);
  };

  const handleUpdateClient = async (e) => {
    e.preventDefault();

    if (isValidFormData()) return;

    try {
      setIsLoading(true);
      await api.put(`clients/${id}`, { name, email });
      setName("");
      setEmail("");
      setId(null);
      setIsFormOpen(!isFormOpen);

      toast({
        title: "Mise à jour réussie",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const toast = useToast();

  useEffect(() => {
    [
      api.get("/clients").then(({ data }) => {
        setClients(data.data);
      }),
    ];
  }, [clients]);

  return (
      <Box>
        <Header />
        <Flex align="center" justifyContent="center">
          <Box
              width={800}
              borderWidth={1}
              borderRadius={8}
              boxShadow="lg"
              p={20}
              mt="25"
          >
            <Flex justifyContent="flex-end">
              <Button
                  colorScheme="green"
                  onClick={() => setIsFormOpen(!isFormOpen)}
              >
                {isFormOpen ? "-" : "+"}
              </Button>
            </Flex>

            {isFormOpen ? (
                <VStack
                    as="form"
                    onSubmit={id ? handleUpdateClient : handleSubmitCreateClient}
                >
                  <FormControl>
                    <FormLabel>Nom</FormLabel>
                    <Input
                        type="text"
                        placeholder="Nom"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
                  </FormControl>

                  <FormControl mt={5}>
                    <FormLabel>Email</FormLabel>
                    <Input
                        type="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                  </FormControl>

                  <Button
                      colorScheme="green"
                      type="submit"
                      mt={6}
                      isLoading={isLoading}
                  >
                    {id ? "Actualiser" : "Inscription"}
                  </Button>
                </VStack>
            ) : null}

            <Table variant="simple" mt={6}>
              <Thead bgColor="blue.500">
                <Tr>
                  <TH>Nom</TH>
                  <TH>Email</TH>
                  <TH>Action</TH>
                </Tr>
              </Thead>
              <Tbody>
                {clients.map((client, index) => (
                    <Tr key={index}>
                      <Td>{client.name}</Td>
                      <Td>{client.email}</Td>
                      <Td justifyContent="space-between">
                        <Flex>
                          <Button
                              size="sm"
                              fontSize="small"
                              colorScheme="yellow"
                              mr="2"
                              onClick={() => handlShowUpdateClient(client)}
                          >
                            Editer
                          </Button>
                          <Button
                              size="sm"
                              fontSize="small"
                              colorScheme="red"
                              mr="2"
                              onClick={() => handleDeleteClient(client._id)}
                          >
                            Supprimer
                          </Button>
                        </Flex>
                      </Td>
                    </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Flex>
      </Box>


  );
}