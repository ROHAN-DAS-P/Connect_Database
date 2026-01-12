const pool = require("../db");
const { v4: uuidv4 } = require("uuid");

exports.createUser = async (req, res) => {
    try {
      const { name, created_by } = req.body;
  
      if (!name || !created_by) {
        return res.status(400).json({ message: "name and created_by are required" });
      }
  
      const userId = uuidv4();
  
      await pool.execute(
        `INSERT INTO users 
         (user_id, name, created_by, updated_by) 
         VALUES (?, ?, ?, ?)`,
        [userId, name, created_by, created_by]
      );
  
      res.status(201).json({
        message: "User created",
        user_id: userId,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  


  exports.updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, updated_by } = req.body;
  
      if (!name || !updated_by) {
        return res.status(400).json({ message: "name and updated_by are required" });
      }
  
      const [result] = await pool.execute(
        `UPDATE users 
         SET name = ?, updated_by = ?, updated_at = NOW()
         WHERE user_id = ?`,
        [name, updated_by, id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json({ message: "User updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  


  exports.getUsers = async (req, res) => {
    try {
      const [rows] = await pool.execute(
        `SELECT user_id, name, created_by, updated_by, created_at, updated_at
         FROM users`
      );
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  


  exports.getUserById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const [rows] = await pool.execute(
        "SELECT * FROM users WHERE user_id = ?",
        [id]
      );
  
      if (rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  


  exports.deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
  
      const [result] = await pool.execute(
        "DELETE FROM users WHERE user_id = ?",
        [id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json({ message: "User deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  