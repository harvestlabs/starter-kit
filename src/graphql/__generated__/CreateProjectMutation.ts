/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateProjectMutation
// ====================================================

export interface CreateProjectMutation_createProject_versions {
  __typename: "ProjectVersion";
  /**
   * The uuid of this project
   */
  id: string;
}

export interface CreateProjectMutation_createProject {
  __typename: "Project";
  /**
   * The uuid of this project
   */
  id: string;
  versions: CreateProjectMutation_createProject_versions[] | null;
}

export interface CreateProjectMutation {
  createProject: CreateProjectMutation_createProject | null;
}

export interface CreateProjectMutationVariables {
  name: string;
}
