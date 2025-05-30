import { FirebaseLogin } from "@/app/components/firebase-login" // Already created

export default function FirebaseTestPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <FirebaseLogin />
      </div>
    </div>
  )
}
