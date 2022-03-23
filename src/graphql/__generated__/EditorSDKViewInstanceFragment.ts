/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: EditorSDKViewInstanceFragment
// ====================================================

export interface EditorSDKViewInstanceFragment_contracts_contractSource {
  __typename: "ContractSource";
  id: string;
  name: string;
  functions: any;
  constructor: any | null;
  abi: any | null;
  events: any;
}

export interface EditorSDKViewInstanceFragment_contracts {
  __typename: "Contract";
  id: string;
  address: string;
  contractSource: EditorSDKViewInstanceFragment_contracts_contractSource;
}

export interface EditorSDKViewInstanceFragment_global_contracts_contractSource {
  __typename: "ContractSource";
  id: string;
  name: string;
  functions: any;
  constructor: any | null;
  abi: any | null;
  events: any;
}

export interface EditorSDKViewInstanceFragment_global_contracts {
  __typename: "Contract";
  id: string;
  address: string;
  contractSource: EditorSDKViewInstanceFragment_global_contracts_contractSource;
}

export interface EditorSDKViewInstanceFragment {
  __typename: "Instance";
  /**
   * The uuid of this instance
   */
  id: string;
  generated_lib: string | null;
  /**
   * The name of the instance
   */
  name: string | null;
  status: number;
  data: any | null;
  /**
   * The id of the project this instance belongs to
   */
  project_id: string;
  /**
   * The id of the project version this instance branched off of
   */
  project_version_id: string;
  contracts: EditorSDKViewInstanceFragment_contracts[];
  global_contracts: EditorSDKViewInstanceFragment_global_contracts[];
}
