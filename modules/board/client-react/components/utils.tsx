import React, { Component } from "react";

export const CrossSymbol = () => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="64" height="64" fill="white" />
    <rect
      width="9.86491"
      height="44.3921"
      rx="4.93245"
      transform="matrix(0.706472 0.707741 -0.706472 0.707741 44.1619 12.8002)"
      fill="#2C8DFF"
    />
    <rect
      width="9.8649"
      height="44.3921"
      rx="4.93245"
      transform="matrix(0.706473 -0.70774 0.706473 0.70774 12.8689 19.7819)"
      fill="#2C8DFF"
    />
  </svg>
);

export const ZeroSymbol = () => (
  <svg
    width="63"
    height="63"
    viewBox="0 0 63 63"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="31.5"
      cy="31.5"
      r="23.625"
      stroke="#FF4F4F"
      stroke-width="15.75"
    />
  </svg>
);

export const getOtherUserFullNameFromBoard = (board: any, currentUserId: number) => {
  const otherUser =
    board?.user1?.id === currentUserId ? board.user2 : board.user1;
  let fullName = "";
  if (otherUser?.firstName && otherUser?.lastName) {
    fullName = `${otherUser.firstName} ${otherUser.lastName}`;
  } else if (otherUser?.firstName && !otherUser?.lastName) {
    fullName = `${otherUser.firstName}`;
  } else if (!otherUser?.firstName && otherUser?.lastName) {
    fullName = `${otherUser.lastName}`;
  } else {
    fullName = "Name not found";
  }
  return fullName;
};

export const getIfCurrentUser1 = (board: any, currentUserId: number) => {
  return board?.user1?.id === currentUserId;
};

export const getBoardCartDescriptionStatement = (
  board: any,
  opponentFullName: string,
  isCurrentUser1: boolean
) => {
  const moves = board.moves;
  if (board.winnerId) {
    if (board.winnerId === board.user1.id) {
      return isCurrentUser1 ? "You won the game" : `${opponentFullName} won!`;
    } else if (board.winnerId === board.user2.id) {
      return isCurrentUser1 ? `${opponentFullName} won!` : "You won the game";
    }
  } else if (moves?.length === 0) {
    return "You haven't started the game yet";
  } else if (moves?.length % 2 === 0) {
    return isCurrentUser1
      ? `${opponentFullName} just made their move. Its your turn to play now`
      : "You've made your move. Waiting for them.";
  } else if (moves?.length % 2 === 1) {
    return isCurrentUser1
      ? "You've made your move. Waiting for them."
      : `${opponentFullName} just made their move. Its your turn to play now`;
  } else {
    return "Something went wrong";
  }
};
