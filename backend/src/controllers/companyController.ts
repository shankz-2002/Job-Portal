import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { getUserById } from "../services/userService";
import { ApiError } from "../utils/apiError";
import { companyProfileService, editCompanyProfile } from "../services/profileService";
import { getAllCompanies, getCompanyProfileById } from "../services/companyService";

export const createProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.user!;
        const found = await getCompanyProfileById(userId);
        if (found) {
            throw new ApiError("Profile already exist", 400);
        }
        const user = await getUserById(userId);
            if (!user) {
                throw new ApiError("User not found", 404)
            }
        const profile = await companyProfileService(req.body, user);
        res.status(200).json({
            success: true,
            message: "profile created successfully",
            profile
        })

    } catch (error) {
        next(error)

    }

}

export const editProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {

        const { userId } = req.user!;
        const company = await getCompanyProfileById(userId);
        if (!company) {
            throw new ApiError("Profile not found", 404);
        }

        const updatedProfile = await editCompanyProfile(req.body, company);
        return res.status(200).json({
            sucess: true,
            message: "Company profile updated successfully",
            profile: updatedProfile
        });

    } catch (error) {
        next(error);

    }

}

export const getCompanyProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.userId;
        const companyId = Number(userId);
        

        const company = await getCompanyProfileById(companyId);
        if (!company) {
            throw new ApiError("Profile not Found", 404);
        }
        res.status(200).json({
            success: true,
            message: "profile fetched successfully",
            company
        })

    } catch (error) {
        next(error);
    }

}


export const getCompanyDetail = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.user!;
        const companyId = userId;

        if (companyId && isNaN(companyId)) {
            throw new ApiError("Invalid company ID", 400);
        }

        let companies;

        if (companyId) {
            // Fetch single company by ID
            const company = await getCompanyProfileById(companyId);
            if (!company) {
                throw new ApiError("No company found", 404);
            }
            companies = [company]; // wrap in array to reuse mapping
        } else {
            // Fetch all companies
            companies = await getAllCompanies();
            if (!companies || companies.length === 0) {
                throw new ApiError("No companies found", 404);
            }
        }
        console.log(companies);


        // Map to format output
        const result = companies.map(company => ({
            id: company.id,
            name: company.companyName,
            email: company.user.email,
            website: company.website,
            address: company.address,
            logourl: company.logourl
        }));

        res.status(200).json({
            success: true,
            message: companyId ? "Company details fetched successfully" : "All companies fetched successfully",
            result: companyId ? result[0] : result
        });

    } catch (error) {
        next(error);
    }
};




