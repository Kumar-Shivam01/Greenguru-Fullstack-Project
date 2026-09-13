import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserData } from "../api/userApi";
import { useState } from "react";
import { sendVerifyOtp, verifyAccount } from "../api/authApi";

const AccountPage = () => {
  const [otp, setOtp] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: getUserData,
  });
  const sendCodeMutation = useMutation({
    mutationFn: sendVerifyOtp,
    onSuccess: (data) => {
      setMessage(data?.message || "Verification code sent to your email.");
      setShowVerification(true);
    },
    onError: (error) => {
      setMessage(
        error?.response?.data?.message ||
        "Unable to send a verification code. Please try again.",
      );
    },
  });

  const verifyAccountMutation = useMutation({
    mutationFn: verifyAccount,
    onSuccess: (data) => {
      setMessage(data?.message || "Account verified successfully.");
      setOtp("");
      setShowVerification(false);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      setMessage(
        error?.response?.data?.message ||
        "The verification code is invalid or expired.",
      );
    },
  });

  const handleVerifyAccount = (event) => {
    event.preventDefault();

    if (!otp.trim()) {
      setMessage("Please enter the verification code sent to your email.");
      return;
    }

    verifyAccountMutation.mutate(otp.trim());
  };
  const user = data?.data;
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center ">
        <p className="text-sm text-[#6f7d72]">Loading your Account...</p>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-red-600">
          Unable to load your account information.
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div>
        <p className="text-sm font-medium text-[#78917c]">
          Your GreenGuru profile
        </p>

        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#26352a]">
          Account
        </h1>

        <p className="mt-2 text-sm text-[#718077]">
          Manage your account information and security.
        </p>
      </div>

      {/* Profile card */}
      <section className="rounded-2xl border border-[#e3e6df] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#dfe9df] text-xl font-semibold text-[#47634d]">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#26352a]">
                {user?.name || "User"}
              </h2>

              <p className="mt-1 text-sm text-[#718077]">{user?.email}</p>
            </div>
          </div>

          <button
            type="button"
            disabled
            className="rounded-xl border border-[#d7ddd5] px-4 py-2.5 text-sm font-medium text-[#8b958d] cursor-not-allowed"
          >
            Edit profile
          </button>
        </div>
      </section>

      {/* Account information */}
      <section className="rounded-2xl border border-[#e3e6df] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#26352a]">
          Account information
        </h2>

        <div className="mt-6 space-y-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[#8a968d]">
              Name
            </p>
            <p className="mt-1 text-sm text-[#344238]">{user?.name || "—"}</p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[#8a968d]">
              Email
            </p>
            <p className="mt-1 text-sm text-[#344238]">{user?.email || "—"}</p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[#8a968d]">
              Account status
            </p>

            <div className="mt-2">
              {user?.isAccountVerified ? (
                <div className="rounded-xl bg-[#edf6ee] p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d9eadb] text-[#47704d]">
                      ✓
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#3f6045]">
                        Account verified
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#6f7d72]">
                        Your account has been successfully verified.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-[#eadcc8] bg-[#fcf7ef] p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f3e5cd] text-[#9a6a32]">
                        !
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-[#7d5a2d]">
                          Account verification required
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#7c756b]">
                          Verify your account to help keep your GreenGuru
                          account secure.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setMessage("");
                        sendCodeMutation.mutate();
                      }}
                      disabled={sendCodeMutation.isPending}
                      className="shrink-0 rounded-xl bg-[#49684f] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#3d5943] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {sendCodeMutation.isPending
                        ? "Sending..."
                        : "Verify account"}
                    </button>
                  </div>
                  {
                    showVerification && (
                      <form
                        onSubmit={handleVerifyAccount}
                        className="mt-4 rounded-xl border border-[#e3e6df] bg-white p-4"
                      >
                        <label
                          htmlFor="verification-code"
                          className="text-sm font-medium text-[#344238]"
                        >
                          Enter verification code
                        </label>

                        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                          <input
                            id="verification-code"
                            type="text"
                            inputMode="numeric"
                            value={otp}
                            onChange={(event) => setOtp(event.target.value)}
                            placeholder="Enter OTP"
                            className="w-full rounded-xl border border-[#cfd8cf] px-3 py-2.5 text-sm outline-none focus:border-[#49684f]"
                          />

                          <button
                            type="submit"
                            disabled={verifyAccountMutation.isPending}
                            className="shrink-0 rounded-xl bg-[#49684f] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#3d5943] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {verifyAccountMutation.isPending ? "Verifying..." : "Confirm code"}
                          </button>
                        </div>
                      </form>
                    )
                  }
                  {message && (
                    <p className="mt-3 text-sm text-[#526b57]">
                      {message}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="rounded-2xl border border-[#e3e6df] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#26352a]">Security</h2>

        <p className="mt-2 text-sm text-[#718077]">
          Keep your GreenGuru account secure.
        </p>

        <button
          type="button"
          className="mt-5 rounded-xl border border-[#cfd8cf] px-4 py-2.5 text-sm font-medium text-[#405247] transition hover:bg-[#f5f7f3]"
        >
          Change password
        </button>
      </section>
    </div>
  );
};
export default AccountPage;
