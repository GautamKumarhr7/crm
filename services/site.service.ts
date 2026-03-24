import { HTTP_STATUS } from "../constant/http.constant";
import { createSite, getSites } from "../repository/site.repository";
import type { CreateSiteInput, ServiceResult, SiteModel } from "../type";

export async function createSiteService(
  input: CreateSiteInput,
  createdBy: number,
): Promise<ServiceResult<{ message: string; site: SiteModel }>> {
  if (!input.projectId || !input.name?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "projectId and site name are required",
    };
  }

  const site = await createSite(
    {
      ...input,
      name: input.name.trim(),
    },
    createdBy,
  );

  return {
    ok: true,
    status: HTTP_STATUS.CREATED,
    data: {
      message: "Site created successfully",
      site,
    },
  };
}

export async function getSitesService(): Promise<
  ServiceResult<{ sites: SiteModel[] }>
> {
  const sites = await getSites();

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { sites },
  };
}
