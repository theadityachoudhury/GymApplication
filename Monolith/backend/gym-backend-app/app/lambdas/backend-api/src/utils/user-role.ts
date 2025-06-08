import { Admin, BaseUser, Client, Coach, UserRole } from '@/models/user.model';
// src/utils/role-utils.ts
import { CoachDataModel, CoachModel } from '@/models/coach.model';
import HttpError from './http-error';
import { logger } from '@/services/logger.service';
import mongoose from 'mongoose';
import { AdminDataModel, AdminEmailsDataModel, ClientDataModel } from '@/models';

export const determineUserRole = async (email: string): Promise<UserRole> => {
  if (!email) {
    logger.warn('Role assignment failed: Email is missing');
    throw new HttpError(400, 'Email is required for role determination');
  }

  try {
    const coachExists = await CoachModel.exists({ email });
    const adminExists = await AdminEmailsDataModel.exists({email});

    if (coachExists) {
      logger.info(`Role assigned: Coach for email ${email}`);
      return UserRole.Coach;
    } else if(adminExists){
      return UserRole.Admin;
    } else {
      logger.info(`Role assigned: Client for email ${email}`);
      return UserRole.Client;
    }
  } catch (error) {
    logger.error('Error during role assignment', error as Error);
    throw new HttpError(500, 'Error determining user role');
  }
};


export const getUserCreator = async (role: UserRole, userData: any): Promise<BaseUser> => {
  // Start a session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let user: BaseUser;

    if (role === UserRole.Client) {
      // Create the client data document within the transaction
      const clientData = await new ClientDataModel({
        target: userData.target,
        preferredActivity: userData.preferableActivity || userData.preferredActivity
      }).save({ session });

      // Create the client user with reference to the client data
      user = await new Client({
        ...userData,
        clientId: clientData._id
      }).save({ session });
    }
    else if (role === UserRole.Coach) {
      // Create the coach data document within the transaction
      const coachData = await new CoachDataModel({
        specialization: userData.specialization || [],
        title: userData.title || '',
        about: userData.about || '',
        rating: userData.rating || 0,
        certificates: userData.certificates || [],
        workingDays: userData.workingDays || []
      }).save({ session });

      // Create the coach user with reference to the coach data
      user = await new Coach({
        ...userData,
        coachId: coachData._id
      }).save({ session });
    }
    else if (role === UserRole.Admin) {
      // Create the admin data document within the transaction
      const adminData = await new AdminDataModel({
        phoneNumber: userData.phoneNumber || 0
      }).save({ session });

      // Create the admin user with reference to the admin data
      user = await new Admin({
        ...userData,
        adminId: adminData._id
      }).save({ session });
    }
    else {
      await session.abortTransaction();
      session.endSession();
      throw new HttpError(400, 'Invalid user role provided');
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return user;
  } catch (error: unknown | HttpError | Error | any) {
    // Abort the transaction on error
    await session.abortTransaction();
    session.endSession();

    if (error instanceof HttpError) throw error;
    throw new HttpError(500, `Error creating user: ${error.message}`);
  }
}