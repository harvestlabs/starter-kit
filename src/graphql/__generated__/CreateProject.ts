/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateProject
// ====================================================

export interface CreateProject_createProject_versions {
  __typename: "ProjectVersion";
  /**
   * The uuid of this project
   */
  id: string;
}

export interface CreateProject_createProject {
  __typename: "Project";
  /**
   * The uuid of this project
   */
  id: string;
  versions: CreateProject_createProject_versions[] | null;
}

export interface CreateProject {
  createProject: CreateProject_createProject | null;
}

export interface CreateProjectVariables {
  name: string;
}
