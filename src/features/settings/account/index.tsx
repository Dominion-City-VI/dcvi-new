import ContentSection from '../components/content-section';
import { AccountForm } from './account-form';

export default function SettingsAccount() {
  return (
    <ContentSection
      title="Account"
      desc="Update your account settings. Change your account password here."
    >
      <AccountForm />
    </ContentSection>
  );
}
