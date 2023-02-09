import { EmployeeAPI } from "../services/EmployeeAPI";
import { VacationAPI } from "../services/VacationAPI";
import { AxiosAPIError, DeleteResponse } from "../services/_ResponseTypes";

export type DeleteReducerActionType =
  | "confirm-click"
  | "close-click"
  | "open-click"
  | "action-success"
  | "action-error";

export type DeleteReducerState = {
  count: number;
  deletionID: string | undefined;
  deletionModel: "Vacation" | "Employee";
  modalOpened: boolean;
  onLoading: boolean;
  error: JSX.Element | null;
  callbackSuccess: (arg: DeleteResponse) => void;
  callbackFail: (arg: AxiosAPIError) => void;
};

export type DeleteReducerAction = {
  type: DeleteReducerActionType;
  payload?: any;
};

export function DeleteModalReducer(
  state: DeleteReducerState,
  action: DeleteReducerAction
) {
  const { type, payload } = action;
  let newState: Partial<DeleteReducerState> = {};
  switch (type) {
    case "action-success":
      newState = {
        onLoading: false,
        modalOpened: false,
        count: state.count + 1,
      };
      break;
    case "action-error":
      newState.onLoading = false;
      newState.error = (payload as { error: JSX.Element }).error;
      break;
    case "confirm-click":
      if (state.deletionID) {
        newState.onLoading = true;
        switch (state.deletionModel) {
          case "Vacation":
            VacationAPI.delete(state.deletionID).then(
              state.callbackSuccess,
              state.callbackFail
            );
            break;
          case "Employee":
            EmployeeAPI.delete(state.deletionID).then(
              state.callbackSuccess,
              state.callbackFail
            );
            break;
        }
      }
      break;
    case "open-click":
      const _typedPayload = payload as { vid: string; model: string };
      console.log(payload);
      newState = {
        onLoading: false,
        error: null,
        modalOpened: true,
        deletionID: _typedPayload.vid,
      };
      break;
    case "close-click":
      newState = {
        deletionID: undefined,
        modalOpened: false,
        onLoading: false,
        error: null,
      };
      break;
    default:
  }
  return {
    ...state,
    ...newState,
  };
}
