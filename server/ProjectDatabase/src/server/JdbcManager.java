package server;
import java.sql.*;

public class JdbcManager {
	public static void main(String[] args) {
		Connection con = null;
		try {
			Class.forName("com.mysql.jdbc.Driver").newInstance();
			String mysqlServer = "72.76.204.54:3306/";
			String dbName = "ece464";
			con = DriverManager.getConnection ("jdbc:mysql://" + mysqlServer + dbName,"root","skdml!Tjqjdlek");
			if(!con.isClosed())
				System.out.println("Successfully connected to MySQL server");
		}
		catch (Exception e) {
			System.out.println(e.toString());
		}
		finally {
			try {
				if(con != null)
					con.close();
			} catch (SQLException e) {}
		}
	}
}
