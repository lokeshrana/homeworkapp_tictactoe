import React from "react";

import { translate, TranslateFunction } from "@gqlapp/i18n-client-react";
import AddBoardView from "../components/AddBoardView";
//@ts-ignore
import { withLoadedUser } from "@gqlapp/user-client-react/containers/AuthBase";
import { compose } from "@gqlapp/core-common";
import { graphql, withApollo } from "react-apollo";
import ADD_BOARD_GQL from "../graphql/AddBoard.graphql";
import { FormError } from "@gqlapp/forms-client-react";

interface AddBoardProps {
  t: TranslateFunction;
}

const AddBoard = withLoadedUser((props: any) => {
  const { addBoard, currentUser, history } = props;
  const handleSubmit = async (values: any) => {
    try {
      const createdBoard = await addBoard({ creatorId: currentUser.id, inviteeEmail: values.email });
      history.push('/board/' + createdBoard.id);
    } catch (e) {
      console.log("🚀 ~ file: AddBoard.tsx ~ line 22 ~ handleSubmit ~ e", e);
      throw new FormError("Add Board form error", e.message);
    }
  };
  return <AddBoardView {...props} onSubmit={handleSubmit} />;
});

const AddBoardWithApollo = compose(
  withApollo,
  graphql(ADD_BOARD_GQL, {
    props: ({ mutate }) => ({
      addBoard: async ({ creatorId, inviteeEmail }: any) => {
        const {
          //@ts-ignore
          data: { addBoard },
        } = await mutate({
          variables: { input: { creatorId, inviteeEmail } },
        });
        return addBoard;
      },
    }),
  })
)(AddBoard);

export default translate("board")(AddBoardWithApollo);
