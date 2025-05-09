import { Post } from "@/types/feed.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IFeed {
  publicFeed: Post[];
}

const initialState: IFeed = {
  publicFeed: [],
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    setPublicFeed: (state, action: PayloadAction<Post[]>) => {
      state.publicFeed = action.payload;
    },
    // Add more reducers as needed
  },
});

export const { setPublicFeed } = feedSlice.actions;
export const feedReducer = feedSlice.reducer;
