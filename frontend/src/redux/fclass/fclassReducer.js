const fclassReducer = (state = { fclassesList: [], loading: false, error: null }, action) => {
    switch (action.type) {
      case 'GET_ALL_FCLASSES':
        return { ...state, fclassesList: action.payload, loading: false };
      case 'CREATE_FCLASS':
        return { ...state, fclassesList: [...state.fclassesList, action.payload] };
      case 'UPDATE_FCLASS':
        return {
          ...state,
          fclassesList: state.fclassesList.map((cls) =>
            cls._id === action.payload._id ? action.payload : cls
          ),
        };
      case 'DELETE_FCLASS':
        return {
          ...state,
          fclassesList: state.fclassesList.filter((cls) => cls._id !== action.payload),
        };
      case 'SET_LOADING':
        return { ...state, loading: true };
      case 'SET_ERROR':
        return { ...state, error: action.payload };
      default:
        return state;
    }
  };
  
  export default fclassReducer;
  