import update from "immutability-helper";


import BOARD_SUBSCRIPTION from "../graphql/BoardSubscription.graphql";

export const subscribeToBoard = (subscribeToMore, boardId, history) =>
  subscribeToMore({
    document: BOARD_SUBSCRIPTION,
    variables: { id: boardId },
    updateQuery: (
      prev,
      {
        subscriptionData: {
          data: {
            boardUpdated: { mutation, node },
          },
        },
      }
    ) => {
      let newResult = prev;
    //   console.log('mutation', mutation, node);
      if (mutation === "UPDATED") {
        newResult = onEditBoard(prev, node);
      } else if (mutation === "DELETED") {
        newResult = onDeleteBoard(history);
      }
      return newResult;
    },
  });

function onEditBoard(prev, node) {
  return update(prev, {
    board: {
      $set: node,
    },
  });
}

const onDeleteBoard = (history) => {
  if (history) {
    return history.push(`/`);
  } else {
    return history.push(`/`);
  }
};

