package server;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.sql.*;
import java.util.ArrayList;
import java.util.Random;

public class RelationMaker {
	
	private static final boolean String = false;
	private Statement s;
	private final int MAX_STUDENTS_PER_PROJ = 4;
	private final int MAX_FACULTY_PER_PROJ = 1;
	private int stuCount = 0, facCount = 0, projCount = 0, courseCount = 0, deptCount = 0;
	
	public RelationMaker(Statement s) {
		this.s = s;
	}
	
	/**
	 * Populate identity tables
	 * @param studentsPath
	 * @param facultyPath
	 * @param projectsPath
	 * @param coursesPath
	 */
	public void populateTables(String studentsPath, String facultyPath, String projectsPath, String coursesPath) {
		BufferedReader students = null, faculty = null, projects = null, courses = null;
		try {
			students = new BufferedReader(new FileReader(studentsPath));
			faculty = new BufferedReader(new FileReader(facultyPath));
			projects = new BufferedReader(new FileReader(projectsPath));
			courses = new BufferedReader(new FileReader(coursesPath));
			
			String curLine;
			String[] splitLine;
			ResultSet rs;
			Random rnd = new Random();
			
			/* Cache departments */
			rs = s.executeQuery("SELECT DISTINCT dname FROM departments");
			ArrayList<String> deptList = new ArrayList<String>();
			while(rs.next()) {
				deptList.add(rs.getString("dname"));
				deptCount++;
			}
			rs.close();
			/* Populate students */
			students.readLine(); //skip header
			while((curLine = students.readLine()) != null) {
				splitLine = curLine.split(",");
				try {
					s.executeUpdate("INSERT INTO students(firstName, lastName, email, gradYear, dname) VALUES('" + splitLine[0] + "', '" + splitLine[1] + "', '" 
							+ splitLine[2] + "', " + splitLine[3] + ", '" + deptList.get(rnd.nextInt(deptCount)) + "');");
					stuCount++;
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
			/* Populate faculty */
			faculty.readLine(); //skip header
			s.executeQuery("SELECT DISTINCT dname FROM departments");
			rs = s.getResultSet();
			while((curLine = faculty.readLine()) != null) {
				splitLine = curLine.split(",");
				try {
					s.executeUpdate("INSERT INTO faculty(firstName, lastName, email, dname) VALUES('" + splitLine[0] + "', '" + splitLine[1] + "', '" + splitLine[2] 
							+ "', '" + deptList.get(rnd.nextInt(deptCount)) + "');");
					facCount++;
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
			/* Populate courses */
			courses.readLine(); //skip header
			ArrayList<String> courseList = new ArrayList<String>();
			while((curLine = courses.readLine()) != null) {
				splitLine = curLine.split(",");	
				try {
					s.executeUpdate("INSERT INTO courses(cname, courseDesc) VALUES('" + splitLine[0] + "', '" + splitLine[1] + "');");
					courseCount++;
				} catch (Exception e) {
					e.printStackTrace();
				}
				
			}
			/* Populate projects, assign random class to each one */
			rs = s.executeQuery("SELECT cid FROM courses");
			while(rs.next()) {
				courseList.add(rs.getString("cid"));
			}
			rs.close();
			projects.readLine(); //skip header
			while((curLine = projects.readLine()) != null) {
				splitLine = curLine.split(",");
				try {
					s.executeUpdate("INSERT INTO projects(projectDesc, term, coverPhotoPath, docPath, likes, cid) VALUES('" + splitLine[0] + "', '" + splitLine[1]
							+ "', '" + splitLine[2]	+ "', '" + splitLine[3] + "', " + splitLine[4] + ", '" + courseList.get(rnd.nextInt(courseCount)) +"');");
					projCount++;
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if(students != null) students.close();
				if(faculty != null) faculty.close();
				if(projects != null) projects.close();
				if(courses != null) courses.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	/*
	 * Run after populating identity tables. Populates relationship tables
	 */
	public void relate() {
		ResultSet rs;
		try {
			ArrayList<String> proj = new ArrayList<String>();
			ArrayList<String> fac = new ArrayList<String>();
			ArrayList<String> course = new ArrayList<String>();
			Random rnd = new Random();
			/* particiation table */
			s.executeUpdate("INSERT INTO participation SELECT S.sid, P.pid FROM students S, projects P ORDER BY RAND() LIMIT " + MAX_STUDENTS_PER_PROJ*projCount + ";");
			
			/* supervisor, under table */
//			rs = s.executeQuery("SELECT pid FROM projects");
//			while(rs.next()) {
//				proj.add(rs.getString("pid"));
//			}
//			rs = s.executeQuery("SELECT fid FROM faculty");
//			while(rs.next()) {
//				fac.add(rs.getString("fid"));
//				facCount++;
//			}
//			rs = s.executeQuery("SELECT cid FROM courses");
//			while(rs.next()) {
//				course.add(rs.getString("cid"));
//				courseCount++;
//			}
//			for(String p : proj) {
//				s.executeUpdate("INSERT INTO supervisor(fid, pid) VALUES(" + fac.get(rnd.nextInt(facCount)) + ", " + p + ");");
//				s.executeUpdate("INSERT INTO under(cid, pid) VALUES(" + course.get(rnd.nextInt(courseCount)) + ", " + p + ");");
//			}
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
	}
}
