import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Friend {
  id: number;
  username: string;
  pfp: string;
}

interface FriendsState {
  friends: Friend[];
}

const initialState: FriendsState = {
  friends: [
    { id: 1, username: 'Friend1', pfp: 'pfp1.jpg' },
    { id: 2, username: 'Friend2', pfp: 'pfp2.jpg' },
  ],
};

const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    setFriends: (state, action: PayloadAction<Friend[]>) => {
      state.friends = action.payload;
    },
    addFriend: (state, action: PayloadAction<Friend>) => {
      state.friends.push(action.payload);
    },
  },
});

export const { setFriends, addFriend } = friendsSlice.actions;
export default friendsSlice.reducer;
