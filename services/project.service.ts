import { HTTP_STATUS } from "../constant/http.constant";
import { createProject, getProjects } from "../repository/project.repository";
import type { CreateProjectInput, ProjectModel, ServiceResult } from "../type";

export async function createProjectService(
  input: CreateProjectInput,
  createdBy: number,
): Promise<ServiceResult<{ message: string; project: ProjectModel }>> {
  if (!input.code?.trim() || !input.name?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Project code and name are required",
    };
  }

  const project = await createProject(
    {
      ...input,
      code: input.code.trim(),
      name: input.name.trim(),
    },
    createdBy,
  );

  return {
    ok: true,
    status: HTTP_STATUS.CREATED,
    data: {
      message: "Project created successfully",
      project,
    },
  };
}

export async function getProjectsService(): Promise<
  ServiceResult<{ projects: ProjectModel[] }>
> {
  const projects = await getProjects();

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { projects },
  };
}
