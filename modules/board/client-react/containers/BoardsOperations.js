import { graphql } from 'react-apollo';
import { PLATFORM, removeTypename } from '@gqlapp/core-common';
import { Message } from '@gqlapp/look-client-react';

import settings from '@gqlapp/config';
// Query
import CURRENT_USER_QUERY from '@gqlapp/user-client-react/graphql/CurrentUserQuery.graphql';
import BOARD_QUERY from '../graphql/BoardQuery.graphql';
// import GET_BOARD_BRAND_LIST_QUERY from '../graphql/GetBrandListQuery.graphql';
import BOARDS_QUERY from '../graphql/BoardsQuery.graphql';
// import MY_BOARDS_BOOKMARK_QUERY from '../graphql/MyBoardsBookmark.graphql';
// import BOARD_BOOKMARK_STATUS from '../graphql/BoardBookmarkStatus.graphql';
// import CAN_USER_REVIEW from '../graphql/CanUserReview.graphql';
// import BOARDS_STATE_QUERY from '../graphql/BoardsStateQuery.client.graphql';

// Mutation
// import ADD_BOARD from '../graphql/AddBoard.graphql';
// import DUPLICATE_BOARD from '../graphql/DuplicateBoard.graphql';
// import EDIT_BOARD from '../graphql/EditBoard.graphql';
// import DELETE_BOARD from '../graphql/DeleteBoard.graphql';
// import TOOGLE_BOARD_BOOKMARK from '../graphql/ToggleBoardBookmark.graphql';
// import SHARE_BOARD_BY_EMAIL from '../graphql/ShareBoardByEmail.graphql';

// Filter
// import UPDATE_ORDER_BY_BOARD from '../graphql/UpdateOrderByBoard.client.graphql';
// import UPDATE_BOARD_FILTER from '../graphql/UpdateBoardFilter.client.graphql';

// import ROUTES from '../routes';

const limit =
  PLATFORM === 'web' || PLATFORM === 'server'
    ? settings.pagination.web.itemsNumber
    : settings.pagination.mobile.itemsNumber;

// Query
// export const withBoardsState = Component =>
//   graphql(BOARDS_STATE_QUERY, {
//     props({ data: { boardsState, loading } }) {
//       return {
//         ...boardsState,
//         loadingState: loading
//       };
//     }
//   })(Component);

export const withCurrentUser = Component =>
  graphql(CURRENT_USER_QUERY, {
    props({ data: { loading, error, currentUser } }) {
      if (error) throw new Error(error);
      return { currentUserLoading: loading, currentUser };
    }
  })(Component);

export const withBoards = Component =>
  graphql(BOARDS_QUERY, {
    options: ({ currentUser }) => {
      return {
        variables: {
          limit: limit,
          after: 0,
          orderBy:{},
          filter: {
            userId: currentUser.id
          }
        },
        fetchPolicy: 'network-only'
      };
    },
    props: ({ data }) => {
      const { loading, error, boards, fetchMore, subscribeToMore, updateQuery } = data;
      const loadData = (after, dataDelivery) => {
        return fetchMore({
          variables: {
            after: after
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const totalCount = fetchMoreResult.boards.totalCount;
            const newEdges = fetchMoreResult.boards.edges;
            const pageInfo = fetchMoreResult.boards.pageInfo;
            const displayedEdges = dataDelivery === 'add' ? [...previousResult.boards.edges, ...newEdges] : newEdges;

            return {
              // By returning `cursor` here, we update the `fetchMore` function
              // to the new cursor.
              boards: {
                totalCount,
                edges: displayedEdges,
                pageInfo,
                __typename: 'Boards'
              }
            };
          }
        });
      };
      if (error) throw new Error(error);
      return { loading, boards, subscribeToMore, loadData, updateQuery };
    }
  })(Component);

export const withBoard = Component =>
  graphql(BOARD_QUERY, {
    options: props => {
    console.log("🚀 ~ file: BoardsOperations.js ~ line 103 ~ props", props)
      let id = 0;
      if (props.match) {
        id = props.match.params.id;
      } else if (props.navigation) {
        id = props.navigation.state.params.id;
      }

      return {
        variables: { id: Number(id) || props.modalId }
      };
    },
    props({ data: { loading, error, board, subscribeToMore, updateQuery } }) {
      if (error) throw new Error(error);
      return { loading, board, subscribeToMore, updateQuery };
    }
  })(Component);





// Filter
// export const withOrderByUpdating = Component =>
//   graphql(UPDATE_ORDER_BY_BOARD, {
//     props: ({ mutate }) => ({
//       onOrderBy: orderBy => {
//         // console.log('orderby', mutate);
//         mutate({ variables: { orderBy } });
//       }
//     })
//   })(Component);

// export const withFilterUpdating = Component =>
//   graphql(UPDATE_BOARD_FILTER, {
//     props: ({ mutate }) => ({
//       onSearchTextChange(searchText) {
//         // console.log("searchtext", searchText);
//         mutate({ variables: { filter: { searchText } } });
//       },
//       onDiscountChange(discount) {
//         mutate({ variables: { filter: { discount } } });
//       },
//       onUpperCostChange(cost) {
//         mutate({ variables: { filter: { upperCost: cost } } });
//       },
//       onLowerCostChange(cost) {
//         mutate({ variables: { filter: { lowerCost: cost } } });
//       },
//       onIsActiveChange(isActive) {
//         mutate({ variables: { filter: { isActive } } });
//       },
//       onBrandChange(brand) {
//         mutate({ variables: { filter: { brand } } });
//       },
//       onRatedChange(popularity) {
//         mutate({ variables: { filter: { popularity } } });
//       },
//       onCategoryChange(categoryFilter) {
//         // console.log(categoryFilter);
//         mutate({
//           variables: {
//             filter: {
//               categoryFilter: {
//                 categoryId: categoryFilter.categoryId,
//                 allSubCategory: categoryFilter.allSubCategory,
//                 __typename: 'CategoryFilter'
//               }
//             }
//           }
//         });
//       },
//       // onIsFeaturedChange(isFeatured) {
//       //   mutate({ variables: { filter: { isFeatured } } });
//       // },
//       // onIsDiscount(isDiscount) {
//       //   mutate({ variables: { filter: { isDiscount } } });
//       // },
//       // onIsNewChange(isNew) {
//       //   mutate({ variables: { filter: { isNew } } });
//       // },
//       onFiltersRemove(filter, orderBy) {
//         mutate({
//           variables: {
//             filter,
//             orderBy
//           }
//         });
//       }
//     })
//   })(Component);