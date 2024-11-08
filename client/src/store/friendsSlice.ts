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
  friends: JSON.parse(localStorage.getItem('friends') || '[]'),
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
      localStorage.setItem('friends', JSON.stringify(state.friends))
    },
  },
});

export const { setFriends, addFriend } = friendsSlice.actions;
export default friendsSlice.reducer;
