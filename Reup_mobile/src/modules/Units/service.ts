import { api } from '@reup/reup-api-sdk';
import { UpdateUnitMemberParams } from '@reup/reup-api-sdk/libs/api/unit/member';
import { IUnitMemberInvitation } from '@reup/reup-api-sdk/libs/api/unit/member/models';
import { CreateUnitMemberParams } from '@reup/reup-api-sdk/src/api/unit/member/index';
import { CreateUnitPetParams } from '@reup/reup-api-sdk/libs/api/unit/pet';
import { CreateUnitVehicleParams } from '@reup/reup-api-sdk/libs/api/unit/vehicle';
import { QueryParamUnit } from '@reup/reup-api-sdk/libs/api/unit';

export const getMembers = async (unitId: string, page?: number, limit?: number) => {
  try {
    const response = await api.Unit.UnitMember.list(unitId, page, limit);
    return { value: response };
  } catch (error) {
    return { error };
  }
};

export const getVehicles = async (unitId: string, page?: number, limit?: number) => {
  try {
    const response = await api.Unit.UnitVehicle.list(unitId, page, limit);
    return { value: response };
  } catch (error) {
    return { error };
  }
};

export const addVehicle = async (unitId: string, params: CreateUnitVehicleParams) => {
  try {
    const response = await api.Unit.UnitVehicle.create(unitId, params);
    return { value: response };
  } catch (error) {
    return { error };
  }
};

export const removeVehicle = async (unitId: string, vehicleId: string) => {
  try {
    const response = await api.Unit.UnitVehicle.remove(unitId, vehicleId);
    return { value: response };
  } catch (error) {
    return { error };
  }
};

export const getPets = async (unitId: string, page?: number, limit?: number) => {
  try {
    const response = await api.Unit.UnitPet.list(unitId, page, limit);
    return { value: response };
  } catch (error) {
    return { error };
  }
};

export const addPet = async (unitId: string, params: CreateUnitPetParams) => {
  try {
    const response = await api.Unit.UnitPet.create(unitId, params);
    return { value: response };
  } catch (error) {
    return { error };
  }
};

export const removePet = async (unitId: string, petId: string) => {
  try {
    const response = await api.Unit.UnitPet.remove(unitId, petId);
    return { value: response };
  } catch (error) {
    return { error };
  }
};

export const invitations = async (unitId: string, params: IUnitMemberInvitation) => {
  try {
    const response = await api.Unit.UnitMember.invitation(unitId, params);
    return { value: response };
  } catch (error) {
    return { error };
  }
};

export const deleteMember = async (unitId: string, id: string) => {
  try {
    const response = await api.Unit.UnitMember.remove(unitId, id);
    return { value: response };
  } catch (error) {
    return { error };
  }
};

export const updateMember = async (unitId: string, id: string, params: UpdateUnitMemberParams) => {
  try {
    const response = await api.Unit.UnitMember.update(unitId, id, params);
    return { value: response };
  } catch (error) {
    return { error };
  }
};

export const createMember: any = async (unitId: string, params: CreateUnitMemberParams) => {
  try {
    const response = await api.Unit.UnitMember.create(unitId, params);
    return { value: response };
  } catch (error) {
    return { error };
  }
};

export const getUnitListMe: any = async (page?: number, limit?: number, query?: QueryParamUnit) => {
  try {
    const response = await api.Unit.me(page, limit, query);
    return { value: response };
  } catch (error) {
    return { error };
  }
};
