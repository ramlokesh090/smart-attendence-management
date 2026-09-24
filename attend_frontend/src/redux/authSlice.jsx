import { createSlice } from "@reduxjs/toolkit";

const getUserFromLocalStorage = () => {
    const user = localStorage.getItem("user");

    if (!user) {
        return null;
    }

    try {
        return JSON.parse(user);
    } catch (error) {
        localStorage.removeItem("user");
        return null;
    }
};

const storedUser = getUserFromLocalStorage();

const initialState = {
    isLoggedIn: storedUser?.status === true,
    userId: storedUser?.userId ?? null,
    role: storedUser?.role ?? null,
    facultyId: storedUser?.facultyId ?? null,
    studentId: storedUser?.studentId ?? null,
    email: storedUser?.email ?? null
};

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {

        loginSuccess: (state, action) => {

            const user = action.payload;

            state.isLoggedIn = true;
            state.userId = user.userId;
            state.role = user.role;
            state.facultyId = user.facultyId;
            state.studentId = user.studentId;
            state.email = user.email;
        },

        logout: (state) => {

            state.isLoggedIn = false;
            state.userId = null;
            state.role = null;
            state.facultyId = null;
            state.studentId = null;
            state.email = null;

            localStorage.removeItem("user");
        }
    }
});

/* IMPORTANT */
export const {
    loginSuccess,
    logout
} = authSlice.actions;

/* Default export */
export default authSlice.reducer;