import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  profileSchema,
  ProfileFormData,
} from "@/features/profile/schemas/profile-schema";
import {
  passwordSchema,
  PasswordFormData,
} from "@/features/profile/schemas/password-schema";
import { updateProfile, updatePassword, deleteAccount } from "@/services/api";
import { setAuth, clearAuth } from "@/logic/store/slices/auth-slice";
import { useAppDispatch, useAppSelector } from "@/logic/store/hooks";
import { removeCookie } from "@/helpers/cookie-utils";
import { translateError } from "@/helpers/error-mapper";

export function useUpdateProfile() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const token = useAppSelector((s) => s.auth.token);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || "" },
  });
  const { t } = useTranslation();
  const onSubmit = (data: ProfileFormData) => {
    setIsLoading(true);
    updateProfile({ name: data.name }, function (_result, error) {
      setIsLoading(false);
      if (error) {
        toast.error(translateError(error.msg, "error:error_update_profile"));
        return;
      }
      if (user && token) {
        dispatch(setAuth({ user: { ...user, name: data.name }, token }));
      }
      toast.success(t("success:perfil_success"));
    });
  };
  return { form, isLoading, onSubmit: form.handleSubmit(onSubmit) };
}
export function useUpdatePassword() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const onSubmit = (data: PasswordFormData) => {
    setIsLoading(true);
    updatePassword(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      function (_result, error) {
        setIsLoading(false);
        if (error) {
          toast.error(translateError(error.msg, "error:error_update_key"));
          return;
        }
        toast.success(t("success:password_success"));
        form.reset();
      },
    );
  };
  return { form, isLoading, onSubmit: form.handleSubmit(onSubmit) };
}
export function useDeleteAccount() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const handleDelete = () => {
    setIsLoading(true);
    deleteAccount(function (_result, error) {
      setIsLoading(false);
      if (error) {
        toast.error(translateError(error.msg, "error:error_removing_account"));
        return;
      }
      removeCookie("token");
      dispatch(clearAuth());
      navigate("/auth/login");
      toast.success(t("success:account_removed"));
    });
  };
  return { isLoading, handleDelete };
}
