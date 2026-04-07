import { HTTP_STATUS } from "../constant/http.constant";
import {
  createVendor,
  findVendorByGstinOrPan,
  getVendors,
} from "../repository/vendor.repository";
import type { CreateVendorInput, ServiceResult, VendorModel } from "../type";

export async function createVendorService(
  input: CreateVendorInput,
  createdBy: number,
): Promise<ServiceResult<{ message: string; vendor: VendorModel }>> {
  if (!input.name?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Name is required",
    };
  }

  if (!input.category?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Category is required",
    };
  }

  if (!input.city?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "City is required",
    };
  }

  if (!input.complianceTax?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Compliance/Tax is required",
    };
  }

  if (!input.gstinOrPan?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "GSTIN / PAN is required",
    };
  }

  if (!input.status?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Status is required",
    };
  }

  const gstinOrPan = input.gstinOrPan.trim();
  const existing = await findVendorByGstinOrPan(gstinOrPan);

  if (existing) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "GSTIN / PAN already exists",
    };
  }

  const vendor = await createVendor(
    {
      name: input.name.trim(),
      category: input.category.trim(),
      city: input.city.trim(),
      complianceTax: input.complianceTax.trim(),
      gstinOrPan,
      status: input.status.trim(),
    },
    createdBy,
  );

  return {
    ok: true,
    status: HTTP_STATUS.CREATED,
    data: {
      message: "Vendor created successfully",
      vendor,
    },
  };
}

export async function getVendorsService(): Promise<
  ServiceResult<{ vendors: VendorModel[] }>
> {
  const vendors = await getVendors();

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { vendors },
  };
}
