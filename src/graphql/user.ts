import { gql } from "@apollo/client";

const userOperations = {
  quires: {
    searchUsers: gql`
      query SearchUsers($name: String!) {
        searchUsers(name: $name) {
          id
          name
          image
        }
      }
    `,
  },
};

export default userOperations;
