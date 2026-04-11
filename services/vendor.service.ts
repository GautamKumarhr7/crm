import { HTTP_STATUS } from "../constant/http.constant";
import {
  createVendor,
  deleteVendor,
  findVendorByPanOrgstin,
  getVendorById,
  getVendors,
  updateVendor,
} from "../repository/vendor.repository";
import type {
  CreateVendorInput,
  ServiceResult,
  UpdateVendorInput,
  VendorModel,
} from "../type";

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

  if (!input.headquater?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Headquater is required",
    };
  }

  if (!input.value?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Value is required",
    };
  }

  if (!input.panOrgstin?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "panOrgstin is required",
    };
  }

  if (!input.status?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Status is required",
    };
  }

  const panOrgstin = input.panOrgstin.trim();
  const existing = await findVendorByPanOrgstin(panOrgstin);

  if (existing) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "panOrgstin already exists",
    };
  }

  const vendor = await createVendor(
    {
      name: input.name.trim(),
      category: input.category.trim(),
      headquater: input.headquater.trim(),
      panOrgstin,
      value: input.value.trim(),
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

export async function getVendorByIdService(
  id: number,
): Promise<ServiceResult<{ vendor: VendorModel }>> {
  const vendor = await getVendorById(id);

  if (!vendor) {
    return {
      ok: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: "Vendor not found",
    };
  }

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { vendor },
  };
}

export async function updateVendorService(
  id: number,
  input: UpdateVendorInput,
): Promise<ServiceResult<{ message: string; vendor: VendorModel }>> {
  const vendor = await getVendorById(id);

  if (!vendor) {
    return {
      ok: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: "Vendor not found",
    };
  }

  const updated = await updateVendor(id, input);

  if (!updated) {
    return {
      ok: false,
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: "Failed to update vendor",
    };
  }

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: {
      message: "Vendor updated successfully",
      vendor: updated,
    },
  };
}

export async function deleteVendorService(
  id: number,
): Promise<ServiceResult<{ message: string }>> {
  const vendor = await getVendorById(id);

  if (!vendor) {
    return {
      ok: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: "Vendor not found",
    };
  }

  const deleted = await deleteVendor(id);

  if (!deleted) {
    return {
      ok: false,
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: "Failed to delete vendor",
    };
  }

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: {
      message: "Vendor deleted successfully",
    },
  };
}
