function createClient(endpoint, { headers, ...other } = {}) {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    ...other,
  };

  async function request(query, variables) {
    const body = JSON.stringify({ query, variables });
    const response = await fetch(endpoint, { ...options, body });

    if (response.ok) {
      return await response.json();
    }

    return {
      errors: [{ message: `${response.status} - "${response.statusText}"` }],
    };
  }

  return {
    request,
  };
}

function gql(chunks, ...variables) {
  return chunks.reduce(
    (accumulator, chunk, index) =>
      `${accumulator}${chunk}${index in variables ? variables[index] : ""}`,
    ""
  );
}

const client = createClient("https://api-kurse.miftahul-ilm.net/graphql");
// const client = createClient("http://localhost:3000/graphql");

export { client, gql };
