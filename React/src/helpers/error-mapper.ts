import i18n from "@/lib/i18n";

export function translateError(msg: string, fallbackKey: string): string {
  if (!msg) return i18n.t(fallbackKey);

  const translationKey = `error:${msg}`;
  const translated = i18n.t(translationKey);

  if (translated !== translationKey) {
    return translated;
  }

  if (
    msg.includes("Cancelamento não permitido") ||
    msg.includes("Antecedência mínima")
  ) {
    return i18n.t("error:cancellation_not_allowed");
  }

  if (msg.includes("Credenciais inválidas")) {
    return i18n.t("error:invalid_credentials");
  }

  if (msg.includes("E-mail já cadastrado")) {
    return i18n.t("error:email_taken");
  }

  if (msg.includes("Conflito de horário")) {
    return i18n.t("error:booking_conflict");
  }

  if (msg.includes("você não tem permissão")) {
    return i18n.t("error:unauthorized_booking_change");
  }

  return msg;
}
