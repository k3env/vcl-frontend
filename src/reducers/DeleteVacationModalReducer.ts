import { AxiosError } from "axios";
import { DeleteVacationResponse, VacationAPI } from "../services/VacationAPI";

export type DeleteVacationReducerActionType =
  | "confirm-click"
  | "close-click"
  | "open-click"
  | "action-success"
  | "action-error";

export type DeleteVacationReducerState = {
  count: number;
  deletionID: number | undefined;
  deletionModel: "Vacation" | "Employee";
  modalOpened: boolean;
  onLoading: boolean;
  error: JSX.Element | null;
  callbackSuccess: (arg: DeleteVacationResponse) => void;
  callbackFail: (arg: AxiosError) => void;
};

export type DeleteVacationReducerAction = {
  type: DeleteVacationReducerActionType;
  payload?: any;
};

export function DeleteVacationModalReducer(
  state: DeleteVacationReducerState,
  action: DeleteVacationReducerAction
) {
  const { type, payload } = action;
  let newState: Partial<DeleteVacationReducerState> = {};
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
        VacationAPI.delete(state.deletionID).then(
          state.callbackSuccess,
          state.callbackFail
        );
      }
      break;
    case "open-click":
      const _typedPayload = payload as { vid: number; model: string };
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
