import { useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiFile,
  FiMinus,
  FiPlus,
  FiUploadCloud,
  FiX,
} from "react-icons/fi";
import { motion } from "framer-motion";
import "./PrintApp.css";

const API_URL = "http://10.39.65.10:5000";

function PrintApp({ onBack }) {
  const [step, setStep] = useState(1);

  // Each file contains its own:
  // file, sessionId, copies, colorMode, paperSize
  const [files, setFiles] = useState([]);

  const [savingSettings, setSavingSettings] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);

  // -----------------------------------------
  // PRICE CALCULATION
  // -----------------------------------------

  const getFilePrice = (fileItem) => {
    const pricePerCopy =
      fileItem.colorMode === "color" ? 10 : 5;

    return fileItem.copies * pricePerCopy;
  };

  const estimatedPrice = files.reduce(
    (total, fileItem) =>
      total + getFilePrice(fileItem),
    0
  );

  // -----------------------------------------
  // FILE UPLOAD
  // -----------------------------------------

  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(
      event.target.files
    );

    if (!selectedFiles.length) return;

    try {
      const uploadedFiles = [];

      for (const selectedFile of selectedFiles) {
        // Create printing session
        const sessionResponse = await fetch(
          `${API_URL}/api/sessions`,
          {
            method: "POST",
          }
        );

        if (!sessionResponse.ok) {
          throw new Error(
            "Could not create printing session"
          );
        }

        const sessionData =
          await sessionResponse.json();

        if (
          !sessionData.success ||
          !sessionData.session?.id
        ) {
          throw new Error(
            "Could not create printing session"
          );
        }

        const newSessionId =
          sessionData.session.id;

        // Upload file to that session
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadResponse = await fetch(
          `${API_URL}/api/sessions/${newSessionId}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!uploadResponse.ok) {
          throw new Error(
            `File upload failed for ${selectedFile.name}`
          );
        }

        const uploadData =
          await uploadResponse.json();

        if (!uploadData.success) {
          throw new Error(
            `File upload failed for ${selectedFile.name}`
          );
        }

        // Store file AND its individual settings
        uploadedFiles.push({
          file: selectedFile,
          sessionId: newSessionId,
          copies: 1,
          colorMode: "color",
          paperSize: "A4",
        });

        console.log(
          "Session created:",
          newSessionId
        );

        console.log(
          "File uploaded:",
          uploadData.session?.file
        );
      }

      // Add newly uploaded files
      setFiles((currentFiles) => [
        ...currentFiles,
        ...uploadedFiles,
      ]);

      setPaymentResult(null);

      // Allow selecting the same file again
      event.target.value = "";
    } catch (error) {
      console.error("Upload error:", error);

      alert(
        "One or more files could not be uploaded. Please try again."
      );

      event.target.value = "";
    }
  };

  // -----------------------------------------
  // REMOVE FILE
  // -----------------------------------------

  const removeFile = (indexToRemove) => {
    setFiles((currentFiles) =>
      currentFiles.filter(
        (_, index) => index !== indexToRemove
      )
    );

    setPaymentResult(null);

    if (files.length === 1) {
      setStep(1);
    }
  };

  // -----------------------------------------
  // UPDATE FILE SETTINGS
  // -----------------------------------------

  const updateFileSetting = (
    index,
    setting,
    value
  ) => {
    setFiles((currentFiles) =>
      currentFiles.map((fileItem, fileIndex) =>
        fileIndex === index
          ? {
              ...fileItem,
              [setting]: value,
            }
          : fileItem
      )
    );
  };

  // -----------------------------------------
  // COPIES
  // -----------------------------------------

  const increaseCopies = (index) => {
    setFiles((currentFiles) =>
      currentFiles.map((fileItem, fileIndex) =>
        fileIndex === index
          ? {
              ...fileItem,
              copies: Math.min(
                fileItem.copies + 1,
                20
              ),
            }
          : fileItem
      )
    );
  };

  const decreaseCopies = (index) => {
    setFiles((currentFiles) =>
      currentFiles.map((fileItem, fileIndex) =>
        fileIndex === index
          ? {
              ...fileItem,
              copies: Math.max(
                fileItem.copies - 1,
                1
              ),
            }
          : fileItem
      )
    );
  };

  // -----------------------------------------
  // SAVE PRINT SETTINGS
  // -----------------------------------------

  const savePrintSettings = async () => {
    if (!files.length) {
      alert("No files selected.");
      return;
    }

    try {
      setSavingSettings(true);

      const settingsPromises = files.map(
        async (fileItem) => {
          const response = await fetch(
            `${API_URL}/api/sessions/${fileItem.sessionId}/settings`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                copies: fileItem.copies,
                colorMode: fileItem.colorMode,
                paperSize: fileItem.paperSize,

                // Price for THIS file only
                estimatedPrice:
                  getFilePrice(fileItem),
              }),
            }
          );

          if (!response.ok) {
            throw new Error(
              "Could not save print settings"
            );
          }

          const data = await response.json();

          if (!data.success) {
            throw new Error(
              "Could not save print settings"
            );
          }

          console.log(
            "Print settings saved:",
            fileItem.file.name,
            data.session?.settings
          );

          return data;
        }
      );

      await Promise.all(settingsPromises);

      setStep(3);
    } catch (error) {
      console.error("Settings error:", error);

      alert(
        "Could not save print settings. Please try again."
      );
    } finally {
      setSavingSettings(false);
    }
  };

  // -----------------------------------------
  // PAYMENT
  // -----------------------------------------

  const handlePayment = async () => {
    if (!files.length) {
      alert("No files selected.");
      return;
    }

    try {
      setProcessingPayment(true);

      // Collect all session IDs into ONE order
      const sessionIds = files
        .map((fileItem) => fileItem.sessionId)
        .filter(Boolean);

      if (sessionIds.length !== files.length) {
        throw new Error(
          "One or more printing sessions are missing."
        );
      }

      // ONE payment request for the entire order
      const response = await fetch(
        `${API_URL}/api/orders/payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionIds,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Payment request failed"
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.message || "Payment failed"
        );
      }

      console.log(
        "Combined order payment successful:",
        data.order
      );

      // Backend returns all paid sessions
      setPaymentResult(data.order.sessions);

      setStep(4);
    } catch (error) {
      console.error(
        "Payment error:",
        error
      );

      alert(
        error.message ||
          "Payment could not be completed. Please try again."
      );
    } finally {
      setProcessingPayment(false);
    }
  };

  // -----------------------------------------
  // BACK
  // -----------------------------------------

  const handleBack = () => {
    if (step === 1) {
      onBack();
      return;
    }

    if (step === 4) {
      return;
    }

    setStep(step - 1);
  };

  // -----------------------------------------
  // PAYMENT DATA
  // -----------------------------------------

  const paymentSessions = Array.isArray(
    paymentResult
  )
    ? paymentResult
    : [];

  const finalAmount = paymentSessions.length
    ? paymentSessions.reduce(
        (total, session) =>
          total +
          Number(
            session?.settings?.estimatedPrice || 0
          ),
        0
      )
    : estimatedPrice;

  // ONE order has ONE payment ID
  const paymentId =
    paymentSessions.find(
      (session) => session?.paymentId
    )?.paymentId || null;

  // ONE order has ONE order ID
  const orderId =
    paymentSessions.find(
      (session) => session?.orderId
    )?.orderId || null;

  // -----------------------------------------
  // RENDER
  // -----------------------------------------

  return (
    <section className="print-app">
      <div className="print-app-container">

        {/* =========================================
            HEADER
        ========================================= */}

        <motion.div
          className="print-app-header"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
        >
          <button
            type="button"
            className="print-back"
            onClick={handleBack}
          >
            <FiArrowLeft />
            Back
          </button>

          <div className="print-step-indicator">

            <span
              className={
                step === 1
                  ? "active"
                  : "completed"
              }
            >
              {step > 1 ? (
                <FiCheckCircle />
              ) : (
                "01"
              )}
            </span>

            <span>Upload</span>

            <div></div>

            <span
              className={
                step === 2
                  ? "active"
                  : step > 2
                  ? "completed"
                  : ""
              }
            >
              {step > 2 ? (
                <FiCheckCircle />
              ) : (
                "02"
              )}
            </span>

            <span>Print settings</span>

            <div></div>

            <span
              className={
                step === 3
                  ? "active"
                  : step > 3
                  ? "completed"
                  : ""
              }
            >
              {step > 3 ? (
                <FiCheckCircle />
              ) : (
                "03"
              )}
            </span>

            <span>Payment</span>

          </div>
        </motion.div>

        {/* =========================================
            STEP 1 — UPLOAD
        ========================================= */}

        {step === 1 && (
          <>
            <motion.div
              className="print-app-title"
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                delay: 0.1,
              }}
            >
              <div className="print-app-label">
                <span></span>
                PRINT YOUR DOCUMENT
              </div>

              <h1>
                Upload your
                <br />
                <span>documents.</span>
              </h1>

              <p>
                Choose one or more documents
                you want to print from your phone.
                We will take care of the rest.
              </p>
            </motion.div>

            <motion.div
              className="upload-card"
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                delay: 0.2,
              }}
            >

              {/* UPLOAD AREA */}

              <label className="upload-area">

                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  multiple
                  onChange={handleFileChange}
                />

                <div className="upload-icon">
                  <FiUploadCloud />
                </div>

                <h2>
                  {files.length
                    ? "Add more files"
                    : "Upload your files"}
                </h2>

                <p>
                  Choose one or more PDF,
                  image, or document files.
                </p>

                <span className="upload-button">
                  {files.length
                    ? "Add files"
                    : "Choose files"}
                </span>

                <small>
                  PDF · JPG · PNG · DOC · DOCX
                </small>

              </label>

              {/* SELECTED FILES */}

              {files.length > 0 && (
                <div className="selected-files">

                  {files.map(
                    (fileItem, index) => (
                      <div
                        className="selected-file"
                        key={`${fileItem.file.name}-${index}`}
                      >

                        <div className="selected-file-icon">
                          <FiFile />
                        </div>

                        <div className="selected-file-info">

                          <strong>
                            {fileItem.file.name}
                          </strong>

                          <span>
                            {(
                              fileItem.file.size /
                              1024 /
                              1024
                            ).toFixed(2)}
                            {" MB"}
                          </span>

                          <div className="file-ready">
                            <FiCheckCircle />
                            File ready
                          </div>

                        </div>

                        <button
                          type="button"
                          className="remove-file"
                          onClick={() =>
                            removeFile(index)
                          }
                          aria-label={`Remove ${fileItem.file.name}`}
                        >
                          <FiX />
                        </button>

                      </div>
                    )
                  )}

                </div>
              )}

            </motion.div>

            <motion.div
              className="print-app-footer"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                duration: 0.6,
                delay: 0.35,
              }}
            >
              <span>
                {files.length > 0
                  ? `${files.length} ${
                      files.length === 1
                        ? "file"
                        : "files"
                    } selected`
                  : "Your files stay private and are used only for printing."}
              </span>

              <button
                type="button"
                className="continue-button"
                disabled={!files.length}
                onClick={() => setStep(2)}
              >
                Continue
                <FiArrowRight />
              </button>
            </motion.div>
          </>
        )}

        {/* =========================================
            STEP 2 — PRINT SETTINGS
        ========================================= */}

        {step === 2 && (
          <>
            <motion.div
              className="print-app-title"
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
              }}
            >
              <div className="print-app-label">
                <span></span>
                PRINT SETTINGS
              </div>

              <h1>
                Make it
                <br />
                <span>your way.</span>
              </h1>

              <p>
                Choose print settings for each
                document before payment.
              </p>
            </motion.div>

            <motion.div
              className="settings-layout"
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                delay: 0.1,
              }}
            >

              {/* DOCUMENTS */}

              <div className="document-summary">

                <div className="settings-card-label">
                  DOCUMENTS
                </div>

                {files.map(
                  (fileItem, index) => (
                    <div
                      className="document-preview"
                      key={`${fileItem.file.name}-${index}`}
                    >
                      <FiFile />

                      <div>
                        <div className="document-name">
                          {fileItem.file.name}
                        </div>

                        <div className="document-size">
                          {(
                            fileItem.file.size /
                            1024 /
                            1024
                          ).toFixed(2)}
                          {" MB"}
                        </div>
                      </div>
                    </div>
                  )
                )}

                <div className="document-ready">
                  <FiCheckCircle />
                  {files.length}{" "}
                  {files.length === 1
                    ? "file"
                    : "files"}{" "}
                  ready to print
                </div>

              </div>

              {/* SETTINGS */}

              <div className="settings-card">

                <div className="settings-card-label">
                  PRINT OPTIONS
                </div>

                {files.map(
                  (fileItem, index) => (
                    <div
                      key={`${fileItem.file.name}-settings-${index}`}
                    >

                      {/* FILE NAME */}

                      <div className="setting-row">

                        <div>
                          <strong>
                            {fileItem.file.name}
                          </strong>

                          <span>
                            Print settings
                          </span>
                        </div>

                      </div>

                      {/* COPIES */}

                      <div className="setting-row">

                        <div>
                          <strong>
                            Copies
                          </strong>

                          <span>
                            Number of copies
                          </span>
                        </div>

                        <div className="copies-control">

                          <button
                            type="button"
                            onClick={() =>
                              decreaseCopies(index)
                            }
                            disabled={
                              fileItem.copies === 1
                            }
                          >
                            <FiMinus />
                          </button>

                          <strong>
                            {fileItem.copies}
                          </strong>

                          <button
                            type="button"
                            onClick={() =>
                              increaseCopies(index)
                            }
                            disabled={
                              fileItem.copies === 20
                            }
                          >
                            <FiPlus />
                          </button>

                        </div>

                      </div>

                      {/* COLOR */}

                      <div className="setting-row">

                        <div>
                          <strong>
                            Color
                          </strong>

                          <span>
                            Choose print mode
                          </span>
                        </div>

                        <div className="option-group">

                          <button
                            type="button"
                            className={
                              fileItem.colorMode ===
                              "color"
                                ? "selected"
                                : ""
                            }
                            onClick={() =>
                              updateFileSetting(
                                index,
                                "colorMode",
                                "color"
                              )
                            }
                          >
                            Color
                          </button>

                          <button
                            type="button"
                            className={
                              fileItem.colorMode ===
                              "bw"
                                ? "selected"
                                : ""
                            }
                            onClick={() =>
                              updateFileSetting(
                                index,
                                "colorMode",
                                "bw"
                              )
                            }
                          >
                            B&W
                          </button>

                        </div>

                      </div>

                      {/* PAPER */}

                      <div className="setting-row">

                        <div>
                          <strong>
                            Paper size
                          </strong>

                          <span>
                            Standard printing paper
                          </span>
                        </div>

                        <select
                          value={
                            fileItem.paperSize
                          }
                          onChange={(event) =>
                            updateFileSetting(
                              index,
                              "paperSize",
                              event.target.value
                            )
                          }
                        >
                          <option value="A4">
                            A4
                          </option>

                          <option value="A5">
                            A5
                          </option>

                          <option value="Letter">
                            Letter
                          </option>
                        </select>

                      </div>

                      {/* FILE PRICE */}

                      <div className="price-summary">

                        <span>
                          File total
                        </span>

                        <strong>
                          ₹{getFilePrice(fileItem)}
                        </strong>

                      </div>

                    </div>
                  )
                )}

                {/* COMPLETE ORDER TOTAL */}

                <div className="price-summary">

                  <span>
                    Estimated total
                  </span>

                  <strong>
                    ₹{estimatedPrice}
                  </strong>

                </div>

              </div>

            </motion.div>

            <motion.div
              className="print-app-footer"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                duration: 0.5,
                delay: 0.25,
              }}
            >
              <span>
                {files.length}{" "}
                {files.length === 1
                  ? "file"
                  : "files"}{" "}
                · Individual settings
              </span>

              <button
                type="button"
                className="continue-button"
                disabled={
                  !files.length ||
                  savingSettings
                }
                onClick={savePrintSettings}
              >
                {savingSettings
                  ? "Saving..."
                  : "Continue"}

                {!savingSettings && (
                  <FiArrowRight />
                )}
              </button>

            </motion.div>
          </>
        )}

        {/* =========================================
            STEP 3 — REVIEW ORDER
        ========================================= */}

        {step === 3 && (
          <motion.div
            className="payment-container payment-review"
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >

            <div className="print-app-label">
              <span></span>
              PAYMENT
            </div>

            <h1>
              Review your
              <br />
              <span>order.</span>
            </h1>

            <p>
              Your print settings have been saved.
              Review everything before payment.
            </p>

            <div className="payment-summary">

              <div>
                <span>
                  Documents
                </span>

                <strong>
                  {files.length}{" "}
                  {files.length === 1
                    ? "file"
                    : "files"}
                </strong>
              </div>

              <div>
                <span>
                  Total copies
                </span>

                <strong>
                  {files.reduce(
                    (total, fileItem) =>
                      total + fileItem.copies,
                    0
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Print modes
                </span>

                <strong>
                  Individual
                </strong>
              </div>

              <div>
                <span>
                  Paper sizes
                </span>

                <strong>
                  Individual
                </strong>
              </div>

              <div className="payment-total">
                <span>
                  Total
                </span>

                <strong>
                  ₹{estimatedPrice}
                </strong>
              </div>

            </div>

            <div className="payment-id">

              <span>
                Files
              </span>

              <strong>
                {files
                  .map(
                    (fileItem) =>
                      fileItem.file.name
                  )
                  .join(", ")}
              </strong>

            </div>

            <div className="payment-actions">

              <button
                type="button"
                className="continue-button"
                onClick={() => setStep(2)}
                disabled={processingPayment}
              >
                <FiArrowLeft />
                Back to settings
              </button>

              <button
                type="button"
                className="continue-button"
                onClick={handlePayment}
                disabled={processingPayment}
              >
                {processingPayment
                  ? "Processing..."
                  : "Proceed to payment"}

                {!processingPayment && (
                  <FiArrowRight />
                )}
              </button>

            </div>

          </motion.div>
        )}

        {/* =========================================
            STEP 4 — PAYMENT SUCCESS
        ========================================= */}

        {step === 4 && (
          <motion.div
            className="payment-container payment-review"
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
          >

            <div className="print-app-label">
              <span></span>
              PAYMENT SUCCESSFUL
            </div>

            <h1>
              Your order is
              <br />
              <span>confirmed.</span>
            </h1>

            <p>
              Your payment has been successfully
              processed. Your printing request is
              now confirmed.
            </p>

            {/* ORDER SUMMARY */}

            <div className="payment-summary">

              <div>
                <span>
                  Documents
                </span>

                <strong>
                  {files.length}{" "}
                  {files.length === 1
                    ? "file"
                    : "files"}
                </strong>
              </div>

              <div>
                <span>
                  Total copies
                </span>

                <strong>
                  {files.reduce(
                    (total, fileItem) =>
                      total + fileItem.copies,
                    0
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Print settings
                </span>

                <strong>
                  Individual
                </strong>
              </div>

              <div className="payment-total">
                <span>
                  Amount paid
                </span>

                <strong>
                  ₹{finalAmount}
                </strong>
              </div>

            </div>

            {/* INDIVIDUAL FILE DETAILS */}

            <div className="payment-id">

              <span>
                PRINT DETAILS
              </span>

              {files.map(
                (fileItem, index) => (
                  <div
                    key={`${fileItem.file.name}-payment-${index}`}
                    style={{
                      marginTop: "14px",
                      paddingBottom: "12px",
                    }}
                  >

                    <strong
                      style={{
                        display: "block",
                        marginBottom: "5px",
                      }}
                    >
                      {fileItem.file.name}
                    </strong>

                    <span>
                      {fileItem.copies}{" "}
                      {fileItem.copies === 1
                        ? "copy"
                        : "copies"}{" "}
                      ·{" "}
                      {fileItem.colorMode ===
                      "color"
                        ? "Color"
                        : "B&W"}{" "}
                      · {fileItem.paperSize}
                      {" "}— ₹
                      {getFilePrice(fileItem)}
                    </span>

                  </div>
                )
              )}

            </div>

            {/* ORDER ID */}

            <div className="payment-id">

              <span>
                Order ID
              </span>

              <strong>
                {orderId ||
                  "Order confirmed"}
              </strong>

            </div>

            {/* PAYMENT ID */}

            <div className="payment-id">

              <span>
                Payment ID
              </span>

              <strong>
                {paymentId ||
                  "Payment completed"}
              </strong>

            </div>

            {/* SUCCESS ACTIONS */}

            <div className="payment-actions">

              <button
                type="button"
                className="continue-button"
                onClick={onBack}
              >
                <FiArrowLeft />
                Back to home
              </button>

              <div className="payment-success-message">
                <FiCheckCircle />
                Payment received
              </div>

            </div>

          </motion.div>
        )}

      </div>
    </section>
  );
}

export default PrintApp;