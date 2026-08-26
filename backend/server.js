import express from "express";
import cors from "cors";
import crypto from "crypto";
import multer from "multer";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({
  path: new URL("./.env", import.meta.url),
});
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// -----------------------------------------
// MYSQL CONNECTION
// -----------------------------------------

const db = mysql.createPool({
  host: process.env.MYSQLHOST || process.env.DB_HOST || "localhost",
  port: Number(process.env.MYSQLPORT || 3306),
  user: process.env.MYSQLUSER || process.env.DB_USER || "root",
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
  database: process.env.MYSQLDATABASE || process.env.DB_NAME || "qr_print",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test MySQL connection
async function testDatabaseConnection() {
  try {
    const connection = await db.getConnection();

    console.log("MySQL connected successfully");

    connection.release();
  } catch (error) {
    console.error("MySQL connection failed:", error.message);
  }
}

// -----------------------------------------
// FILE UPLOAD CONFIGURATION
// -----------------------------------------

const upload = multer({
  dest: "uploads/",
});

// -----------------------------------------
// HOME
// -----------------------------------------

app.get("/", (req, res) => {
  res.json({
    message: "QR Print backend is running!",
  });
});

// -----------------------------------------
// HEALTH CHECK
// -----------------------------------------

app.get("/api/health", async (req, res) => {
  try {
    await db.query("SELECT 1");

    res.json({
      success: true,
      message: "QR Print API is healthy",
      database: "connected",
    });
  } catch (error) {
    console.error("Health check database error:", error);

    res.status(500).json({
      success: false,
      message: "QR Print API is running but database is unavailable",
    });
  }
});

// -----------------------------------------
// CREATE SESSION
// -----------------------------------------

app.post("/api/sessions", async (req, res) => {
  try {
    const sessionId = crypto.randomUUID();

    // QR link that belongs to this session
    const qrData = `https://qr-print-lyart.vercel.app/print/${sessionId}`;

    await db.query(
      `
      INSERT INTO print_sessions
      (
        session_id,
        qr_data,
        status,
        payment_status
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        sessionId,
        qrData,
        "created",
        "pending",
      ]
    );

    const [rows] = await db.query(
      `
      SELECT *
      FROM print_sessions
      WHERE session_id = ?
      `,
      [sessionId]
    );

    const session = rows[0];

res.status(201).json({
  success: true,

  session: {
    ...session,

    // Frontend uses session.id as the printing session ID.
    // The MySQL numeric id must NOT be exposed as that value.
    id: session.session_id,
  },
});
  } catch (error) {
    console.error("Create session error:", error);

    res.status(500).json({
      success: false,
      message: "Could not create printing session",
    });
  }
});

// -----------------------------------------
// GET SESSION
// -----------------------------------------

app.get("/api/sessions/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    const [rows] = await db.query(
      `
      SELECT *
      FROM print_sessions
      WHERE session_id = ?
      `,
      [sessionId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Printing session not found",
      });
    }

   const session = rows[0];

res.json({
  success: true,

  session: {
    ...session,
    id: session.session_id,
  },
});
  } catch (error) {
    console.error("Get session error:", error);

    res.status(500).json({
      success: false,
      message: "Could not retrieve printing session",
    });
  }
});

// -----------------------------------------
// UPLOAD FILE
// -----------------------------------------

app.post(
  "/api/sessions/:sessionId/upload",
  upload.single("file"),
  async (req, res) => {
    try {
      const { sessionId } = req.params;

      const [rows] = await db.query(
        `
        SELECT *
        FROM print_sessions
        WHERE session_id = ?
        `,
        [sessionId]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Printing session not found",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      await db.query(
        `
        UPDATE print_sessions
        SET
          original_name = ?,
          mime_type = ?,
          file_size = ?,
          stored_name = ?,
          status = ?
        WHERE session_id = ?
        `,
        [
          req.file.originalname,
          req.file.mimetype,
          req.file.size,
          req.file.filename,
          "file_uploaded",
          sessionId,
        ]
      );

      const [updatedRows] = await db.query(
        `
        SELECT *
        FROM print_sessions
        WHERE session_id = ?
        `,
        [sessionId]
      );

      res.json({
        success: true,
        message: "File uploaded successfully",

        session: {
          ...updatedRows[0],

          // Keep frontend response compatible
          file: {
            originalName: updatedRows[0].original_name,
            mimeType: updatedRows[0].mime_type,
            size: updatedRows[0].file_size,
            storedName: updatedRows[0].stored_name,
          },
        },
      });
    } catch (error) {
      console.error("Upload error:", error);

      res.status(500).json({
        success: false,
        message: "File upload failed",
      });
    }
  }
);

// -----------------------------------------
// SAVE PRINT SETTINGS
// -----------------------------------------

app.put(
  "/api/sessions/:sessionId/settings",
  async (req, res) => {
    try {
      const { sessionId } = req.params;

      const {
        copies,
        colorMode,
        paperSize,
        estimatedPrice,
      } = req.body;

      const [rows] = await db.query(
        `
        SELECT *
        FROM print_sessions
        WHERE session_id = ?
        `,
        [sessionId]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Printing session not found",
        });
      }

      await db.query(
        `
        UPDATE print_sessions
        SET
          copies = ?,
          color_mode = ?,
          paper_size = ?,
          estimated_price = ?,
          status = ?
        WHERE session_id = ?
        `,
        [
          copies,
          colorMode,
          paperSize,
          estimatedPrice,
          "settings_saved",
          sessionId,
        ]
      );

      const [updatedRows] = await db.query(
        `
        SELECT *
        FROM print_sessions
        WHERE session_id = ?
        `,
        [sessionId]
      );

      const session = updatedRows[0];

      res.json({
        success: true,
        message: "Print settings saved successfully",

        session: {
          ...session,

          // Keep frontend compatible
          settings: {
            copies: session.copies,
            colorMode: session.color_mode,
            paperSize: session.paper_size,
            estimatedPrice: session.estimated_price,
          },
        },
      });
    } catch (error) {
      console.error("Save settings error:", error);

      res.status(500).json({
        success: false,
        message: "Could not save print settings",
      });
    }
  }
);

// -----------------------------------------
// INDIVIDUAL PAYMENT
// -----------------------------------------
// Kept for compatibility.
// Your current frontend uses the combined payment endpoint.
// -----------------------------------------

app.post(
  "/api/sessions/:sessionId/payment",
  async (req, res) => {
    const connection = await db.getConnection();

    try {
      const { sessionId } = req.params;

      await connection.beginTransaction();

      const [rows] = await connection.query(
        `
        SELECT *
        FROM print_sessions
        WHERE session_id = ?
        FOR UPDATE
        `,
        [sessionId]
      );

      if (rows.length === 0) {
        await connection.rollback();

        return res.status(404).json({
          success: false,
          message: "Printing session not found",
        });
      }

      const session = rows[0];

      if (!session.estimated_price && session.estimated_price !== 0) {
        await connection.rollback();

        return res.status(400).json({
          success: false,
          message: "Print settings have not been saved",
        });
      }

      if (session.payment_status === "paid") {
        await connection.rollback();

        return res.json({
          success: true,
          message: "Payment already completed",
          session,
        });
      }

      const paymentId = `PAY-${crypto.randomUUID()}`;
      const orderId = `ORD-${crypto.randomUUID()}`;
      const paidAt = new Date();

      await connection.query(
        `
        UPDATE print_sessions
        SET
          payment_status = ?,
          status = ?,
          payment_id = ?,
          order_id = ?,
          paid_at = ?
        WHERE session_id = ?
        `,
        [
          "paid",
          "payment_completed",
          paymentId,
          orderId,
          paidAt,
          sessionId,
        ]
      );

      await connection.query(
        `
        INSERT INTO payments
        (
          session_id,
          payment_id,
          amount,
          status
        )
        VALUES (?, ?, ?, ?)
        `,
        [
          sessionId,
          paymentId,
          session.estimated_price || 0,
          "success",
        ]
      );

      await connection.commit();

      const [updatedRows] = await db.query(
        `
        SELECT *
        FROM print_sessions
        WHERE session_id = ?
        `,
        [sessionId]
      );

      res.json({
        success: true,
        message: "Payment completed successfully",

        session: {
          ...updatedRows[0],

          settings: {
            copies: updatedRows[0].copies,
            colorMode: updatedRows[0].color_mode,
            paperSize: updatedRows[0].paper_size,
            estimatedPrice: updatedRows[0].estimated_price,
          },
        },
      });
    } catch (error) {
      await connection.rollback();

      console.error("Individual payment error:", error);

      res.status(500).json({
        success: false,
        message: "Payment could not be completed",
      });
    } finally {
      connection.release();
    }
  }
);

// -----------------------------------------
// COMBINED ORDER PAYMENT
// -----------------------------------------

app.post(
  "/api/orders/payment",
  async (req, res) => {
    const connection = await db.getConnection();

    try {
      const { sessionIds } = req.body;

      if (
        !Array.isArray(sessionIds) ||
        sessionIds.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message: "No printing sessions provided",
        });
      }

      // Remove accidental duplicate session IDs
      const uniqueSessionIds = [
        ...new Set(sessionIds),
      ];

      await connection.beginTransaction();

      const orderSessions = [];

      // -----------------------------------------
      // VALIDATE ALL SESSIONS FIRST
      // -----------------------------------------

      for (const sessionId of uniqueSessionIds) {
        const [rows] = await connection.query(
          `
          SELECT *
          FROM print_sessions
          WHERE session_id = ?
          FOR UPDATE
          `,
          [sessionId]
        );

        if (rows.length === 0) {
          await connection.rollback();

          return res.status(404).json({
            success: false,
            message:
              "One or more printing sessions not found",
          });
        }

        const session = rows[0];

        if (!session.original_name) {
          await connection.rollback();

          return res.status(400).json({
            success: false,
            message:
              "One or more files have not been uploaded",
          });
        }

        if (
          session.copies === null ||
          session.color_mode === null ||
          session.paper_size === null ||
          session.estimated_price === null
        ) {
          await connection.rollback();

          return res.status(400).json({
            success: false,
            message:
              "Print settings have not been saved for one or more files",
          });
        }

        if (session.payment_status === "paid") {
          await connection.rollback();

          return res.status(400).json({
            success: false,
            message:
              "One or more files have already been paid for",
          });
        }

        orderSessions.push(session);
      }

      // -----------------------------------------
      // CALCULATE TOTAL FROM DATABASE
      // -----------------------------------------

      const totalAmount = orderSessions.reduce(
        (total, session) =>
          total +
          Number(session.estimated_price || 0),
        0
      );

      // -----------------------------------------
      // CREATE ONE ORDER + ONE PAYMENT
      // -----------------------------------------

      const orderId = `ORD-${crypto.randomUUID()}`;
      const paymentId = `PAY-${crypto.randomUUID()}`;
      const paidAt = new Date();

      // -----------------------------------------
      // UPDATE ALL PRINT SESSIONS
      // -----------------------------------------

      for (const session of orderSessions) {
        await connection.query(
          `
          UPDATE print_sessions
          SET
            payment_status = ?,
            status = ?,
            payment_id = ?,
            order_id = ?,
            paid_at = ?
          WHERE session_id = ?
          `,
          [
            "paid",
            "payment_completed",
            paymentId,
            orderId,
            paidAt,
            session.session_id,
          ]
        );

        // -----------------------------------------
        // INSERT PAYMENT RECORD
        // -----------------------------------------

        await connection.query(
          `
          INSERT INTO payments
          (
            session_id,
            payment_id,
            amount,
            status
          )
          VALUES (?, ?, ?, ?)
          `,
          [
            session.session_id,
            paymentId,
            Number(session.estimated_price || 0),
            "success",
          ]
        );
      }

      // -----------------------------------------
      // COMMIT EVERYTHING
      // -----------------------------------------

      await connection.commit();

      // -----------------------------------------
      // GET UPDATED SESSIONS
      // -----------------------------------------

      const updatedSessions = [];

      for (const session of orderSessions) {
        const [rows] = await db.query(
          `
          SELECT *
          FROM print_sessions
          WHERE session_id = ?
          `,
          [session.session_id]
        );

        if (rows.length > 0) {
          const updatedSession = rows[0];

          updatedSessions.push({
            ...updatedSession,

            // Keep frontend compatible
            file: {
              originalName:
                updatedSession.original_name,
              mimeType:
                updatedSession.mime_type,
              size:
                updatedSession.file_size,
              storedName:
                updatedSession.stored_name,
            },

            settings: {
              copies:
                updatedSession.copies,
              colorMode:
                updatedSession.color_mode,
              paperSize:
                updatedSession.paper_size,
              estimatedPrice:
                updatedSession.estimated_price,
            },

            // Frontend currently expects this
            paymentId:
              updatedSession.payment_id,

            orderId:
              updatedSession.order_id,

            paidAt:
              updatedSession.paid_at,
          });
        }
      }

      // -----------------------------------------
      // RESPONSE
      // -----------------------------------------

      res.json({
        success: true,

        message:
          "Order payment completed successfully",

        order: {
          orderId,
          paymentId,
          totalAmount,
          paidAt,

          sessions: updatedSessions,
        },
      });
    } catch (error) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error(
          "Rollback error:",
          rollbackError
        );
      }

      console.error(
        "Combined payment error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Payment could not be completed",
      });
    } finally {
      connection.release();
    }
  }
);

// -----------------------------------------
// START SERVER
// -----------------------------------------

app.listen(PORT, "0.0.0.0", async () => {
  console.log(
    `QR Print backend running on port ${PORT}`
  );

  await testDatabaseConnection();
});
