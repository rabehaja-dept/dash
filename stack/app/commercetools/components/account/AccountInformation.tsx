import { useTranslation } from "react-i18next";
import { Button } from "~/components/interactive";
import { UserAccountInformation } from "~/routes/commercetools/account";

export type AccountInformationProps = UserAccountInformation;

export default function AccountInformation({
  firstName,
  lastName,
  email,
}: AccountInformationProps) {
  const { t } = useTranslation("commercetools");
  return (
    <div className="border-weak mt-[40px] border pb-[40px] pl-[40px] pr-[40px] pt-[40px]">
      <h1 className="flex pb-[16px] text-body-lg font-bold text-text-base">
        {t("Account Information")}
      </h1>
      <div className="border-weak border-b" />
      <div>
        <h3 className="pb-[16px] pt-[32px] text-body-sm font-bold text-text-base">
          {t("Contact information")}
        </h3>
        <div className="flex overflow-hidden">
          <p className="w-1/2 text-text-base">
            {firstName} {lastName}
          </p>
          <p className="w-1/2 truncate text-ellipsis text-text-base">{email}</p>
        </div>
        <div className="flex pt-[16px]">
          <Button
            className="inline-block px-0 py-0 font-sourceCodePro text-body-sm  text-text-base underline"
            disabled
            variant="custom"
          >
            {t("EDIT")}
          </Button>
          <div className="border-r pl-[24px] text-text-base" />
          <Button
            className="inline-block px-0 py-0 pl-[24px] font-sourceCodePro text-body-sm text-text-base underline"
            disabled
            variant="custom"
          >
            {t("CHANGE PASSWORD")}
          </Button>
        </div>
      </div>
    </div>
  );
}
