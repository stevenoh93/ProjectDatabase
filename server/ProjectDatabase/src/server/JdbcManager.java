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
			if(!con.isClosed()) {
				System.out.println("Successfully connected to MySQL server");
				Statement s = con.createStatement();
				RelationMaker rel = new RelationMaker(s);
				//rel.populateTables("D:\\Projects\\ProjectDatabase\\Students.csv", "D:\\Projects\\ProjectDatabase\\Faculty.csv", "D:\\Projects\\ProjectDatabase\\Projects.csv", "D:\\Projects\\ProjectDatabase\\Courses.csv");
				rel.relate();
				s.close();
			}
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
